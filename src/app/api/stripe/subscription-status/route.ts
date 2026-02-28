import { NextResponse } from "next/server";
import { getAdminServicesOrNull } from "@/lib/firebaseAdmin";
import { normalizeManualOverride, resolvePlusAccess } from "@/lib/entitlements";

export const dynamic = "force-dynamic";

function getBearerToken(request: Request): string {
  const authHeader = request.headers.get("authorization") || "";
  if (!authHeader.toLowerCase().startsWith("bearer ")) return "";
  return authHeader.slice(7).trim();
}

function normalizePlan(plan: unknown, isSubscribed: boolean): "plus" | "free" {
  const normalized = String(plan || "").toLowerCase();
  if (normalized === "plus" || normalized === "free") return normalized;
  return isSubscribed ? "plus" : "free";
}

function normalizeStatus(value: unknown, isSubscribed: boolean): string {
  const raw = String(value || "").trim().toLowerCase();
  if (raw) return raw;
  return isSubscribed ? "active" : "none";
}

export async function POST(request: Request) {
  try {
    const services = getAdminServicesOrNull();
    if (!services) {
      console.error("stripe.subscription-status.error", "Missing Firebase admin environment variables");
      return NextResponse.json(
        { error: "Missing Firebase admin environment variables" },
        { status: 500 },
      );
    }

    const token = getBearerToken(request);
    if (!token) {
      return NextResponse.json({ error: "Missing bearer token" }, { status: 401 });
    }

    const decoded = await services.auth.verifyIdToken(token).catch(() => null);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid bearer token" }, { status: 401 });
    }

    const uid = decoded.uid;
    const userRef = services.db.collection("users").doc(uid);
    const snapshot = await userRef.get();
    const data = (snapshot.exists ? snapshot.data() : {}) as Record<string, unknown>;

    const explicitIsSubscribed =
      typeof data.isSubscribed === "boolean" ? data.isSubscribed : null;

    const fallbackHasPlusAccess = resolvePlusAccess({
      hasPlusAccess: Boolean(data.hasPlusAccess),
      plan: String(data.plan || "FREE"),
      subscriptionStatus: String(data.subscriptionStatus || "none"),
      manualOverride: normalizeManualOverride(data.manualOverride),
    });

    const isSubscribed = explicitIsSubscribed ?? fallbackHasPlusAccess;
    const plan = normalizePlan(data.plan, isSubscribed);
    const status = normalizeStatus(data.subscriptionStatus, isSubscribed);
    const cancelAtPeriodEnd = Boolean(data.cancelAtPeriodEnd);
    const currentPeriodEnd =
      typeof data.currentPeriodEnd === "number" && Number.isFinite(data.currentPeriodEnd)
        ? data.currentPeriodEnd
        : null;

    return NextResponse.json({
      isSubscribed,
      plan,
      status,
      cancelAtPeriodEnd,
      currentPeriodEnd,
      hasSubscription: isSubscribed,
      hasPlusAccess: isSubscribed,
      subscriptionStatus: status,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch subscription status";
    console.error("stripe.subscription-status.error", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
