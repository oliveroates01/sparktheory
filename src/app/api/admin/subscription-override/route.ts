import { NextResponse } from "next/server";
import { upsertUserSubscription } from "@/lib/subscriptionAccess";

export const runtime = "nodejs";

type OverridePayload = {
  uid?: string;
  email?: string;
  isSubscribed?: boolean;
  plan?: string;
};

function getAdminSecret(request: Request): string {
  return (request.headers.get("x-admin-secret") || "").trim();
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

    const payload = (await request.json().catch(() => ({}))) as OverridePayload;
    const uid = (payload.uid || "").trim();
    const email = (payload.email || "").trim().toLowerCase();
    const isSubscribed = payload.isSubscribed ?? true;
    const plan = (payload.plan || (isSubscribed ? "plus" : "free")).toLowerCase();

    if (!uid && !email) {
      return NextResponse.json({ error: "uid or email is required" }, { status: 400 });
    }

    const result = await upsertUserSubscription({
      uid,
      email,
      isSubscribed,
      plan,
      subscriptionStatus: isSubscribed ? "active" : "canceled",
    });

    if (!result.updated) {
      return NextResponse.json(
        { error: "User not found for override", reason: result.reason },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      uid: result.uid,
      isSubscribed,
      plan,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Override failed";
    console.error("admin.subscription-override.error", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
