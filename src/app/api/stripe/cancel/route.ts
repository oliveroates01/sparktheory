import { NextResponse } from "next/server";
import {
  cancelSubscriptionAtPeriodEnd,
  findCustomerByEmail,
  listSubscriptions,
  pickCurrentSubscription,
} from "@/lib/stripe";

type CancelPayload = {
  email?: string;
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json().catch(() => ({}))) as CancelPayload;

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

    if (current.cancel_at_period_end) {
      return NextResponse.json({
        cancelled: true,
        cancelAtPeriodEnd: true,
        currentPeriodEnd: current.current_period_end ?? null,
      });
    }

    const updated = await cancelSubscriptionAtPeriodEnd(current.id);

    return NextResponse.json({
      cancelled: true,
      cancelAtPeriodEnd: updated.cancel_at_period_end,
      currentPeriodEnd: updated.current_period_end ?? null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Cancellation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
