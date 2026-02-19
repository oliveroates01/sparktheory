import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function verifyStripeSignature(payload: string, signatureHeader: string, secret: string) {
  const parts = signatureHeader.split(",").map((p) => p.trim());
  const timestamp = parts.find((p) => p.startsWith("t="))?.slice(2);
  const v1 = parts.find((p) => p.startsWith("v1="))?.slice(3);

  if (!timestamp || !v1) {
    return false;
  }

  const signedPayload = `${timestamp}.${payload}`;
  const expected = createHmac("sha256", secret).update(signedPayload).digest("hex");

  const expectedBuffer = Buffer.from(expected, "utf8");
  const v1Buffer = Buffer.from(v1, "utf8");

  if (expectedBuffer.length !== v1Buffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, v1Buffer);
}

export async function POST(request: Request) {
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });
    }

    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
    }

    const payload = await request.text();

    if (!verifyStripeSignature(payload, signature, webhookSecret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(payload) as {
      type: string;
      data?: { object?: Record<string, unknown> };
    };

    switch (event.type) {
      case "checkout.session.completed":
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
      case "invoice.payment_succeeded":
      case "invoice.payment_failed":
        console.log("stripe.webhook", event.type, event.data?.object);
        break;
      default:
        console.log("stripe.webhook.unhandled", event.type);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook handler failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
