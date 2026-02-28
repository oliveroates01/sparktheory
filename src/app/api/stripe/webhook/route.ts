import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import {
  isStripeActiveStatus,
  upsertUserSubscription,
} from "@/lib/subscriptionAccess";

export const runtime = "nodejs";

const STRIPE_TOLERANCE_SECONDS = 300;

type StripeWebhookEvent = {
  type: string;
  data?: {
    object?: Record<string, unknown>;
  };
};

function toNonEmptyString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function getObjectId(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const id = (value as { id?: unknown }).id;
    return typeof id === "string" ? id : "";
  }
  return "";
}

function parseSignatureHeader(signatureHeader: string) {
  const parts = signatureHeader.split(",").map((part) => part.trim());
  const timestamp = toNonEmptyString(parts.find((part) => part.startsWith("t="))?.slice(2));
  const signatures = parts
    .filter((part) => part.startsWith("v1="))
    .map((part) => toNonEmptyString(part.slice(3)))
    .filter(Boolean);

  return { timestamp, signatures };
}

function verifyStripeSignature(payload: string, signatureHeader: string, secret: string) {
  const { timestamp, signatures } = parseSignatureHeader(signatureHeader);
  if (!timestamp || signatures.length === 0) return false;

  const ts = Number(timestamp);
  if (!Number.isFinite(ts)) return false;

  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - ts) > STRIPE_TOLERANCE_SECONDS) {
    return false;
  }

  const signedPayload = `${timestamp}.${payload}`;
  const expected = createHmac("sha256", secret).update(signedPayload).digest("hex");

  const expectedBuffer = Buffer.from(expected, "utf8");
  return signatures.some((candidate) => {
    const candidateBuffer = Buffer.from(candidate, "utf8");
    if (candidateBuffer.length !== expectedBuffer.length) return false;
    return timingSafeEqual(candidateBuffer, expectedBuffer);
  });
}

function getEventObject(event: StripeWebhookEvent) {
  return (event.data?.object || {}) as Record<string, unknown>;
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("stripe.webhook.error", "Missing STRIPE_WEBHOOK_SECRET");
    return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    console.error("stripe.webhook.error", "Missing stripe-signature header");
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const rawBody = await request.text();

  if (!verifyStripeSignature(rawBody, signature, webhookSecret)) {
    console.error("stripe.webhook.error", "Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: StripeWebhookEvent;
  try {
    event = JSON.parse(rawBody) as StripeWebhookEvent;
  } catch {
    console.error("stripe.webhook.error", "Invalid JSON payload");
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const object = getEventObject(event);
        const metadata = (object.metadata || {}) as Record<string, unknown>;

        const userId =
          toNonEmptyString(metadata.userId) ||
          toNonEmptyString(object.client_reference_id);
        const email =
          toNonEmptyString(metadata.email) ||
          toNonEmptyString(object.customer_email) ||
          toNonEmptyString((object.customer_details as { email?: unknown } | undefined)?.email);
        const stripeCustomerId = getObjectId(object.customer);
        const stripeSubscriptionId = getObjectId(object.subscription);

        const result = await upsertUserSubscription({
          uid: userId,
          email,
          stripeCustomerId,
          stripeSubscriptionId,
          isSubscribed: true,
          plan: "plus",
          subscriptionStatus: "active",
        });

        console.log("stripe.webhook", event.type, {
          userId,
          email,
          stripeCustomerId,
          stripeSubscriptionId,
          updated: result.updated,
          reason: "reason" in result ? result.reason : undefined,
        });
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const object = getEventObject(event);
        const metadata = (object.metadata || {}) as Record<string, unknown>;
        const status = toNonEmptyString(object.status);
        const isSubscribed = isStripeActiveStatus(status);

        const userId = toNonEmptyString(metadata.userId);
        const email = toNonEmptyString(metadata.email);
        const stripeCustomerId = getObjectId(object.customer);
        const stripeSubscriptionId = getObjectId(object.id);

        const result = await upsertUserSubscription({
          uid: userId,
          email,
          stripeCustomerId,
          stripeSubscriptionId,
          isSubscribed,
          plan: isSubscribed ? "plus" : "free",
          subscriptionStatus: status || (isSubscribed ? "active" : "canceled"),
        });

        console.log("stripe.webhook", event.type, {
          userId,
          email,
          stripeCustomerId,
          stripeSubscriptionId,
          status,
          isSubscribed,
          updated: result.updated,
          reason: "reason" in result ? result.reason : undefined,
        });
        break;
      }

      default:
        console.log("stripe.webhook.unhandled", event.type);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook handler failed";
    console.error("stripe.webhook.error", { type: event.type, message });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
