import { FieldValue } from "firebase-admin/firestore";
import { getAdminServicesOrNull } from "@/lib/firebaseAdmin";

type ResolveUserRefInput = {
  uid?: string;
  email?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
};

type UpsertSubscriptionInput = ResolveUserRefInput & {
  isSubscribed: boolean;
  plan?: string;
  subscriptionStatus?: string;
  cancelAtPeriodEnd?: boolean;
  currentPeriodEnd?: number | null;
};

function toNonEmptyString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizePlan(plan: string, isSubscribed: boolean): "plus" | "free" {
  const normalized = plan.trim().toLowerCase();
  if (normalized === "plus" || normalized === "free") return normalized;
  return isSubscribed ? "plus" : "free";
}

async function findUserRef(input: ResolveUserRefInput) {
  const services = getAdminServicesOrNull();
  if (!services) return null;

  const uid = toNonEmptyString(input.uid);
  const email = toNonEmptyString(input.email).toLowerCase();
  const stripeCustomerId = toNonEmptyString(input.stripeCustomerId);
  const stripeSubscriptionId = toNonEmptyString(input.stripeSubscriptionId);

  if (uid) return services.db.collection("users").doc(uid);

  if (stripeSubscriptionId) {
    const snap = await services.db
      .collection("users")
      .where("stripeSubscriptionId", "==", stripeSubscriptionId)
      .limit(1)
      .get();
    if (!snap.empty) return snap.docs[0].ref;
  }

  if (stripeCustomerId) {
    const snap = await services.db
      .collection("users")
      .where("stripeCustomerId", "==", stripeCustomerId)
      .limit(1)
      .get();
    if (!snap.empty) return snap.docs[0].ref;
  }

  if (email) {
    const snap = await services.db
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();
    if (!snap.empty) return snap.docs[0].ref;
  }

  return null;
}

export function isStripeActiveStatus(status: string) {
  return status === "active" || status === "trialing";
}

export async function upsertUserSubscription(input: UpsertSubscriptionInput) {
  const services = getAdminServicesOrNull();
  if (!services) {
    throw new Error("Missing Firebase admin environment variables");
  }

  const userRef = await findUserRef(input);
  if (!userRef) {
    return { updated: false, reason: "user_not_found" as const };
  }

  const stripeCustomerId = toNonEmptyString(input.stripeCustomerId);
  const stripeSubscriptionId = toNonEmptyString(input.stripeSubscriptionId);
  const subscriptionStatus = toNonEmptyString(input.subscriptionStatus);
  const isSubscribed = Boolean(input.isSubscribed);
  const plan = normalizePlan(toNonEmptyString(input.plan), isSubscribed);

  const updatePayload: Record<string, unknown> = {
    isSubscribed,
    hasPlusAccess: isSubscribed,
    plan,
    subscriptionStatus: subscriptionStatus || (isSubscribed ? "active" : "canceled"),
    updatedAt: FieldValue.serverTimestamp(),
  };

  if (typeof input.cancelAtPeriodEnd === "boolean") {
    updatePayload.cancelAtPeriodEnd = input.cancelAtPeriodEnd;
  }

  if (typeof input.currentPeriodEnd === "number") {
    updatePayload.currentPeriodEnd = input.currentPeriodEnd;
  } else if (input.currentPeriodEnd === null) {
    updatePayload.currentPeriodEnd = null;
  }

  if (stripeCustomerId) updatePayload.stripeCustomerId = stripeCustomerId;
  if (stripeSubscriptionId) updatePayload.stripeSubscriptionId = stripeSubscriptionId;

  await userRef.set(updatePayload, { merge: true });
  return { updated: true as const, uid: userRef.id };
}
