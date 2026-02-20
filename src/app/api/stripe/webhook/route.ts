import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminServicesOrNull } from "@/lib/firebaseAdmin";

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

function getString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function statusToPlan(status: string): "PLUS" | "FREE" {
  return status === "active" ? "PLUS" : "FREE";
}

function statusToAccess(status: string): boolean {
  return status === "active";
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
    const object = (event.data?.object || {}) as Record<string, any>;

    const services = getAdminServicesOrNull();
    if (!services) {
      return NextResponse.json(
        { error: "Missing Firebase admin environment variables" },
        { status: 500 }
      );
    }
    const adminDb = services.db;

    async function updateUserByUidOrEmail(
      uid: string,
      email: string,
      status: string
    ) {
      const updatePayload = {
        plan: statusToPlan(status),
        subscriptionStatus: status,
        hasPlusAccess: statusToAccess(status),
        updatedAt: FieldValue.serverTimestamp(),
      };

      if (uid) {
        await adminDb.collection("users").doc(uid).set(updatePayload, { merge: true });
        return;
      }

      if (!email) return;
      const snap = await adminDb
        .collection("users")
        .where("email", "==", email)
        .limit(1)
        .get();
      if (snap.empty) return;
      await snap.docs[0].ref.set(updatePayload, { merge: true });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const uid = getString(object.client_reference_id) || getString(object.metadata?.firebaseUid);
        const email =
          getString(object.customer_email) ||
          getString(object.customer_details?.email) ||
          getString(object.metadata?.email);
        await updateUserByUidOrEmail(uid, email, "active");
        console.log("stripe.webhook", event.type, { uid, email, status: "active" });
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const uid = getString(object.metadata?.firebaseUid);
        const email = getString(object.metadata?.email);
        const status = getString(object.status) || "none";
        await updateUserByUidOrEmail(uid, email, status);
        console.log("stripe.webhook", event.type, { uid, email, status });
        break;
      }
      case "invoice.payment_succeeded": {
        const uid = getString(object.metadata?.firebaseUid);
        const email = getString(object.customer_email) || getString(object.metadata?.email);
        await updateUserByUidOrEmail(uid, email, "active");
        console.log("stripe.webhook", event.type, { uid, email, status: "active" });
        break;
      }
      case "invoice.payment_failed": {
        const uid = getString(object.metadata?.firebaseUid);
        const email = getString(object.customer_email) || getString(object.metadata?.email);
        await updateUserByUidOrEmail(uid, email, "past_due");
        console.log("stripe.webhook", event.type, { uid, email, status: "past_due" });
        break;
      }
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
