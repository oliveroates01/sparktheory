import { FieldValue, Timestamp } from "firebase-admin/firestore";
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

function toUnixSeconds(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (value && typeof value === "object") {
    const maybe = value as { toMillis?: () => number; seconds?: number; _seconds?: number };
    if (typeof maybe.toMillis === "function") {
      const ms = maybe.toMillis();
      if (Number.isFinite(ms)) return Math.floor(ms / 1000);
    }
    if (typeof maybe.seconds === "number" && Number.isFinite(maybe.seconds)) {
      return Math.floor(maybe.seconds);
    }
    if (typeof maybe._seconds === "number" && Number.isFinite(maybe._seconds)) {
      return Math.floor(maybe._seconds);
    }
  }
  return null;
}

export function computeHasPlusAccessFromStripeState(params: {
  subscriptionStatus?: string;
  cancelAtPeriodEnd?: boolean;
  currentPeriodEnd?: number | null;
  nowSeconds?: number;
}) {
  const status = toNonEmptyString(params.subscriptionStatus).toLowerCase();
  const cancelAtPeriodEnd = Boolean(params.cancelAtPeriodEnd);
  const currentPeriodEnd = typeof params.currentPeriodEnd === "number" ? params.currentPeriodEnd : null;
  const now = params.nowSeconds ?? Math.floor(Date.now() / 1000);

  if (status === "active" || status === "trialing") {
    if (!cancelAtPeriodEnd) return true;
    if (!currentPeriodEnd) return true;
    return now < currentPeriodEnd;
  }
  if (status === "canceled") return false;
  if (status === "past_due" || status === "unpaid") return false;
  return false;
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
  const currentSnap = await userRef.get();
  const existing = (currentSnap.exists ? currentSnap.data() : {}) as Record<string, unknown>;

  const stripeCustomerId = toNonEmptyString(input.stripeCustomerId);
  const stripeSubscriptionId = toNonEmptyString(input.stripeSubscriptionId);
  const subscriptionStatus =
    toNonEmptyString(input.subscriptionStatus) ||
    toNonEmptyString(existing.subscriptionStatus) ||
    (Boolean(input.isSubscribed) ? "active" : "canceled");
  const effectiveCancelAtPeriodEnd =
    typeof input.cancelAtPeriodEnd === "boolean"
      ? input.cancelAtPeriodEnd
      : Boolean(existing.cancelAtPeriodEnd);
  const effectiveCurrentPeriodEnd =
    typeof input.currentPeriodEnd === "number" && Number.isFinite(input.currentPeriodEnd)
      ? input.currentPeriodEnd
      : toUnixSeconds(existing.currentPeriodEnd);
  const hasPlusAccess = computeHasPlusAccessFromStripeState({
    subscriptionStatus,
    cancelAtPeriodEnd: effectiveCancelAtPeriodEnd,
    currentPeriodEnd: effectiveCurrentPeriodEnd,
  });
  const isSubscribed = hasPlusAccess;
  const plan = normalizePlan(toNonEmptyString(input.plan), hasPlusAccess);

  const updatePayload: Record<string, unknown> = {
    isSubscribed,
    hasPlusAccess,
    plan,
    subscriptionStatus,
    updatedAt: FieldValue.serverTimestamp(),
  };

  if (typeof input.cancelAtPeriodEnd === "boolean") {
    updatePayload.cancelAtPeriodEnd = input.cancelAtPeriodEnd;
  }

  if (typeof input.currentPeriodEnd === "number" && Number.isFinite(input.currentPeriodEnd)) {
    // Stripe provides seconds; persist Firestore Timestamp for consistent server-side date semantics.
    updatePayload.currentPeriodEnd = Timestamp.fromMillis(Math.floor(input.currentPeriodEnd * 1000));
  }

  if (stripeCustomerId) updatePayload.stripeCustomerId = stripeCustomerId;
  if (stripeSubscriptionId) updatePayload.stripeSubscriptionId = stripeSubscriptionId;

  await userRef.set(updatePayload, { merge: true });
  return { updated: true as const, uid: userRef.id };
}
