import { NextResponse } from "next/server";
import {
  findCustomerByEmail,
  listSubscriptions,
  pickCurrentSubscription,
} from "@/lib/stripe";
import { getAdminServicesOrNull } from "@/lib/firebaseAdmin";
import { normalizeManualOverride, resolvePlusAccess } from "@/lib/entitlements";

type SubscriptionStatusPayload = {
  email?: string;
  uid?: string;
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json().catch(() => ({}))) as SubscriptionStatusPayload;

    if (!payload.email && !payload.uid) {
      return NextResponse.json({ error: "Email or uid is required" }, { status: 400 });
    }

    const services = getAdminServicesOrNull();
    let userDocData: Record<string, unknown> = {};
    if (services && payload.uid) {
      const userRef = services.db.collection("users").doc(payload.uid);
      const snapshot = await userRef.get();
      if (snapshot.exists) {
        userDocData = snapshot.data() || {};
      }
    }

    let current:
      | {
          status: string;
          cancel_at_period_end: boolean;
          current_period_end?: number;
        }
      | undefined;
    if (payload.email) {
      const customer = await findCustomerByEmail(payload.email);
      if (customer) {
        const subscriptions = await listSubscriptions(customer.id);
        current = pickCurrentSubscription(subscriptions);
      }
    }

    const plan = String(userDocData.plan || "FREE");
    const subscriptionStatus = String(userDocData.subscriptionStatus || "none");
    const manualOverride = normalizeManualOverride(userDocData.manualOverride);
    const storedHasPlusAccess = Boolean(userDocData.hasPlusAccess);
    const hasPlusAccess = resolvePlusAccess({
      hasPlusAccess: storedHasPlusAccess,
      plan,
      subscriptionStatus,
      manualOverride,
    });

    return NextResponse.json({
      hasSubscription: hasPlusAccess,
      hasPlusAccess,
      plan,
      subscriptionStatus,
      manualOverride,
      status: current?.status || subscriptionStatus,
      cancelAtPeriodEnd: current?.cancel_at_period_end ?? false,
      currentPeriodEnd: current?.current_period_end ?? null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch subscription status";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
