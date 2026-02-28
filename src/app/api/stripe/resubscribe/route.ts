import { NextResponse } from "next/server";
import {
  findCustomerByEmail,
  listSubscriptions,
  pickCurrentSubscription,
  resumeSubscriptionAtPeriodEnd,
} from "@/lib/stripe";
import { upsertUserSubscription } from "@/lib/subscriptionAccess";

type ResubscribePayload = {
  email?: string;
  uid?: string;
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json().catch(() => ({}))) as ResubscribePayload;

    if (!payload.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const customer = await findCustomerByEmail(payload.email);

    if (!customer) {
      return NextResponse.json({ error: "No Stripe customer found for this email" }, { status: 404 });
    }

    const subscriptions = await listSubscriptions(customer.id);
    const current = pickCurrentSubscription(subscriptions);

    if (!current) {
      return NextResponse.json({ error: "No active subscription found" }, { status: 404 });
    }

    const updated = current.cancel_at_period_end
      ? await resumeSubscriptionAtPeriodEnd(current.id)
      : current;

    await upsertUserSubscription({
      uid: payload.uid,
      email: payload.email,
      stripeCustomerId: customer.id,
      stripeSubscriptionId: updated.id,
      isSubscribed: updated.status === "active" || updated.status === "trialing",
      plan: updated.status === "active" || updated.status === "trialing" ? "plus" : "free",
      subscriptionStatus: updated.status,
      cancelAtPeriodEnd: updated.cancel_at_period_end,
      currentPeriodEnd: typeof updated.current_period_end === "number" ? updated.current_period_end : null,
    });

    return NextResponse.json({
      status: updated.status,
      cancelAtPeriodEnd: updated.cancel_at_period_end,
      currentPeriodEnd: updated.current_period_end ?? null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Resubscribe failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
