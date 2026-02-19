import { NextResponse } from "next/server";
import {
  findCustomerByEmail,
  listSubscriptions,
  pickCurrentSubscription,
} from "@/lib/stripe";

type SubscriptionStatusPayload = {
  email?: string;
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json().catch(() => ({}))) as SubscriptionStatusPayload;

    if (!payload.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const customer = await findCustomerByEmail(payload.email);

    if (!customer) {
      return NextResponse.json({ hasSubscription: false, hasPlusAccess: false });
    }

    const subscriptions = await listSubscriptions(customer.id);
    const current = pickCurrentSubscription(subscriptions);

    if (!current) {
      return NextResponse.json({ hasSubscription: false, hasPlusAccess: false });
    }

    return NextResponse.json({
      hasSubscription: true,
      hasPlusAccess: true,
      status: current.status,
      cancelAtPeriodEnd: current.cancel_at_period_end,
      currentPeriodEnd: current.current_period_end ?? null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch subscription status";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
