import { NextResponse } from "next/server";
import { createCheckoutSession, getBaseUrl } from "@/lib/stripe";

type CheckoutPayload = {
  email?: string;
  uid?: string;
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json().catch(() => ({}))) as CheckoutPayload;
    const priceId = process.env.STRIPE_PRICE_ID;

    if (!priceId) {
      return NextResponse.json(
        { error: "Missing STRIPE_PRICE_ID" },
        { status: 500 },
      );
    }

    const baseUrl = getBaseUrl(request.url);
    const session = await createCheckoutSession({
      priceId,
      email: payload.email,
      uid: payload.uid,
      successUrl: `${baseUrl}/account?checkout=success`,
      cancelUrl: `${baseUrl}/account?checkout=cancelled`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL" },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
