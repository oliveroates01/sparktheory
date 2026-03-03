import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { getAdminServicesOrNull } from "@/lib/firebaseAdmin";
import { computeHasPlusAccessFromStripeState } from "@/lib/subscriptionAccess";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getUnixSeconds(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (value && typeof value === "object") {
    const maybe = value as { toMillis?: () => number; seconds?: number; _seconds?: number };
    if (typeof maybe.toMillis === "function") {
      const ms = maybe.toMillis();
      if (Number.isFinite(ms)) return Math.floor(ms / 1000);
    }
    if (typeof maybe.seconds === "number" && Number.isFinite(maybe.seconds)) {
      return Math.floor(maybe.seconds);
    }
    if (typeof maybe._seconds === "number" && Number.isFinite(maybe._seconds)) {
      return Math.floor(maybe._seconds);
    }
  }
  return null;
}

function getUnixMillis(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (value && typeof value === "object") {
    const maybe = value as { toMillis?: () => number; seconds?: number; _seconds?: number };
    if (typeof maybe.toMillis === "function") {
      const ms = maybe.toMillis();
      if (Number.isFinite(ms)) return ms;
    }
    if (typeof maybe.seconds === "number" && Number.isFinite(maybe.seconds)) {
      return Math.floor(maybe.seconds * 1000);
    }
    if (typeof maybe._seconds === "number" && Number.isFinite(maybe._seconds)) {
      return Math.floor(maybe._seconds * 1000);
    }
  }
  return null;
}

function isAuthorized(request: Request) {
  const vercelCronHeader = (request.headers.get("x-vercel-cron") || "").trim();
  if (vercelCronHeader) return true;

  const expectedSecret = (process.env.CRON_SECRET || "").trim();
  if (!expectedSecret) return false;
  const authHeader = (request.headers.get("authorization") || "").trim();
  if (!authHeader.toLowerCase().startsWith("bearer ")) return false;
  return authHeader.slice(7).trim() === expectedSecret;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const services = getAdminServicesOrNull();
  if (!services) {
    return NextResponse.json(
      { error: "Missing Firebase admin environment variables" },
      { status: 500 }
    );
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  const nowMillis = Date.now();
  const graceDays = Number.isFinite(Number(process.env.PAST_DUE_GRACE_DAYS))
    ? Math.max(0, Number(process.env.PAST_DUE_GRACE_DAYS))
    : 3;
  const graceMillis = graceDays * 24 * 60 * 60 * 1000;

  const usersSnap = await services.db.collection("users").get();
  let evaluated = 0;
  let updated = 0;

  for (const doc of usersSnap.docs) {
    const data = doc.data() as Record<string, unknown>;
    const status = String(data.subscriptionStatus || "").toLowerCase();
    const cancelAtPeriodEnd = Boolean(data.cancelAtPeriodEnd);
    const currentPeriodEnd = getUnixSeconds(data.currentPeriodEnd);
    const hasPlusAccess = Boolean(data.hasPlusAccess);
    const updatedAtMs = getUnixMillis(data.updatedAt);

    const shouldLockForPastDue =
      (status === "past_due" || status === "unpaid") &&
      typeof updatedAtMs === "number" &&
      nowMillis - updatedAtMs >= graceMillis;

    const shouldHaveAccess = computeHasPlusAccessFromStripeState({
      subscriptionStatus: status,
      cancelAtPeriodEnd,
      currentPeriodEnd,
      nowSeconds,
    });

    evaluated += 1;

    if (!shouldHaveAccess || shouldLockForPastDue) {
      if (!hasPlusAccess && data.isSubscribed === false) continue;
      await doc.ref.set(
        {
          hasPlusAccess: false,
          isSubscribed: false,
          plan: "free",
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
      updated += 1;
    }
  }

  return NextResponse.json({
    ok: true,
    evaluated,
    updated,
    nowSeconds,
    graceDays,
  });
}

