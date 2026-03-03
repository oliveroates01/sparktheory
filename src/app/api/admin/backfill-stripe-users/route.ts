import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { getAdminServicesOrNull } from "@/lib/firebaseAdmin";
import {
  computeHasPlusAccessFromStripeState,
  upsertUserSubscription,
} from "@/lib/subscriptionAccess";
import { normalizeManualOverride } from "@/lib/entitlements";

export const runtime = "nodejs";

type BackfillPayload = {
  dryRun?: boolean;
};

type StripeCustomer = {
  id: string;
  email?: string | null;
};

type StripeSubscription = {
  id: string;
  status: string;
  created?: number;
  cancel_at_period_end?: boolean;
  current_period_end?: number | null;
  cancel_at?: number | null;
  items?: {
    data?: Array<{
      current_period_end?: number | null;
    }>;
  };
};

function getAdminSecret(request: Request): string {
  return (
    request.headers.get("ADMIN_SECRET") ||
    request.headers.get("admin_secret") ||
    request.headers.get("x-admin-secret") ||
    ""
  ).trim();
}

function getSecretKey() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) throw new Error("Missing STRIPE_SECRET_KEY");
  return secretKey;
}

async function stripeGet<T>(path: string, query: URLSearchParams) {
  const response = await fetch(`https://api.stripe.com/v1/${path}?${query.toString()}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
    },
  });
  const json = (await response.json().catch(() => ({}))) as T & {
    error?: { message?: string };
  };
  if (!response.ok) {
    throw new Error(json.error?.message || "Stripe request failed");
  }
  return json as T;
}

async function findBestCustomerByEmail(email: string) {
  const query = new URLSearchParams();
  query.set("email", email);
  query.set("limit", "5");
  const result = await stripeGet<{ data: StripeCustomer[] }>("customers", query);
  const exact = result.data.find(
    (customer) => (customer.email || "").trim().toLowerCase() === email.trim().toLowerCase()
  );
  return exact || null;
}

async function getMostRecentSubscription(customerId: string) {
  const allowed = new Set(["active", "trialing", "past_due", "unpaid", "canceled"]);
  const query = new URLSearchParams();
  query.set("customer", customerId);
  query.set("status", "all");
  query.set("limit", "10");
  const result = await stripeGet<{ data: StripeSubscription[] }>("subscriptions", query);
  if (!Array.isArray(result.data) || result.data.length === 0) return null;
  const filtered = result.data.filter((subscription) => allowed.has(String(subscription.status || "")));
  if (filtered.length === 0) return null;
  const sorted = [...filtered].sort((a, b) => (Number(b.created) || 0) - (Number(a.created) || 0));
  return sorted[0];
}

function getPeriodEndSec(subscription: StripeSubscription) {
  return (
    (typeof subscription.current_period_end === "number" ? subscription.current_period_end : null) ??
    (typeof subscription.cancel_at === "number" ? subscription.cancel_at : null) ??
    (typeof subscription.items?.data?.[0]?.current_period_end === "number"
      ? subscription.items.data[0].current_period_end
      : null)
  );
}

export async function POST(request: Request) {
  try {
    const expectedSecret = (process.env.ADMIN_SECRET || "").trim();
    if (!expectedSecret) {
      return NextResponse.json({ error: "Missing ADMIN_SECRET" }, { status: 500 });
    }

    const providedSecret = getAdminSecret(request);
    if (!providedSecret || providedSecret !== expectedSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const services = getAdminServicesOrNull();
    if (!services) {
      return NextResponse.json(
        { error: "Missing Firebase admin environment variables" },
        { status: 500 }
      );
    }

    const payload = (await request.json().catch(() => ({}))) as BackfillPayload;
    const dryRun = Boolean(payload.dryRun);

    const hasPlusSnap = await services.db
      .collection("users")
      .where("hasPlusAccess", "==", true)
      .get();

    let scanned = 0;
    let updated = 0;
    let locked = 0;
    let skipped = 0;
    let errors = 0;
    const logs: Array<Record<string, unknown>> = [];

    for (const doc of hasPlusSnap.docs) {
      const data = doc.data() as Record<string, unknown>;
      const stripeCustomerId = String(data.stripeCustomerId || "").trim();
      const subscriptionStatus = String(data.subscriptionStatus || "").trim().toLowerCase();

      // Target only users with missing customer id OR status none.
      if (stripeCustomerId && subscriptionStatus !== "none") continue;
      scanned += 1;

      const email = String(data.email || "").trim().toLowerCase();
      if (!email) {
        skipped += 1;
        logs.push({ uid: doc.id, action: "skip", reason: "missing_email" });
        continue;
      }

      try {
        const customer = await findBestCustomerByEmail(email);
        if (!customer) {
          const manualOverride = normalizeManualOverride(data.manualOverride);
          if (manualOverride !== "none") {
            skipped += 1;
            logs.push({ uid: doc.id, action: "skip", reason: "manual_override", manualOverride });
            continue;
          }
          locked += 1;
          logs.push({ uid: doc.id, action: "lock", reason: "no_customer_or_subscription" });
          if (!dryRun) {
            await doc.ref.set(
              {
                hasPlusAccess: false,
                isSubscribed: false,
                plan: "free",
                updatedAt: FieldValue.serverTimestamp(),
              },
              { merge: true }
            );
          }
          continue;
        }

        const subscription = await getMostRecentSubscription(customer.id);
        if (!subscription) {
          const manualOverride = normalizeManualOverride(data.manualOverride);
          if (manualOverride !== "none") {
            skipped += 1;
            logs.push({ uid: doc.id, action: "skip", reason: "manual_override", manualOverride });
            continue;
          }
          locked += 1;
          logs.push({ uid: doc.id, action: "lock", reason: "no_subscription", customerId: customer.id });
          if (!dryRun) {
            await doc.ref.set(
              {
                stripeCustomerId: customer.id,
                hasPlusAccess: false,
                isSubscribed: false,
                plan: "free",
                updatedAt: FieldValue.serverTimestamp(),
              },
              { merge: true }
            );
          }
          continue;
        }

        const periodEndSec = getPeriodEndSec(subscription);
        const hasAccess = computeHasPlusAccessFromStripeState({
          subscriptionStatus: subscription.status,
          cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end),
          currentPeriodEnd: typeof periodEndSec === "number" ? periodEndSec : null,
        });

        logs.push({
          uid: doc.id,
          action: "update",
          customerId: customer.id,
          subscriptionId: subscription.id,
          status: subscription.status,
          cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end),
          currentPeriodEnd: periodEndSec ?? null,
          hasAccess,
        });
        updated += 1;

        if (!dryRun) {
          await upsertUserSubscription({
            uid: doc.id,
            email,
            stripeCustomerId: customer.id,
            stripeSubscriptionId: subscription.id,
            isSubscribed: hasAccess,
            plan: hasAccess ? "plus" : "free",
            subscriptionStatus: subscription.status,
            cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end),
            currentPeriodEnd: typeof periodEndSec === "number" ? periodEndSec : null,
          });
        }
      } catch (error) {
        errors += 1;
        logs.push({
          uid: doc.id,
          action: "error",
          error: error instanceof Error ? error.message : "unknown_error",
        });
      }
    }

    return NextResponse.json({
      ok: true,
      dryRun,
      scanned,
      updated,
      locked,
      skipped,
      errors,
      logs,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Backfill failed";
    console.error("admin.backfill-stripe-users.error", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return POST(request);
}
