import { NextResponse } from "next/server";
import {
  findCustomerByEmail,
  listSubscriptions,
  pickCurrentSubscription,
} from "@/lib/stripe";
import { getAdminServicesOrNull } from "@/lib/firebaseAdmin";
import { normalizeManualOverride, resolvePlusAccess } from "@/lib/entitlements";

function getBearerToken(request: Request): string {
  const authHeader = request.headers.get("authorization") || "";
  if (!authHeader.toLowerCase().startsWith("bearer ")) return "";
  return authHeader.slice(7).trim();
}

export async function POST(request: Request) {
  try {
    const services = getAdminServicesOrNull();
    if (!services) {
      return NextResponse.json(
        { error: "Missing Firebase admin environment variables" },
        { status: 500 }
      );
    }

    const token = getBearerToken(request);
    if (!token) {
      return NextResponse.json({ error: "Missing bearer token" }, { status: 401 });
    }

    const decoded = await services.auth
      .verifyIdToken(token)
      .catch(() => null);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid bearer token" }, { status: 401 });
    }

    const uid = decoded.uid;
    const email = decoded.email || "";

    let userDocData: Record<string, unknown> = {};
    const userRef = services.db.collection("users").doc(uid);
    const snapshot = await userRef.get();
    if (snapshot.exists) {
      userDocData = snapshot.data() || {};
    }

    let current:
      | {
          status: string;
          cancel_at_period_end: boolean;
          current_period_end?: number;
        }
      | undefined;
    if (email) {
      const customer = await findCustomerByEmail(email);
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
