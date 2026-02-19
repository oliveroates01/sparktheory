import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type UserPlan = "FREE" | "PLUS";

type UpsertUserProfileInput = {
  uid: string;
  email: string;
  displayName?: string;
  plan?: UserPlan;
  hasPlusAccess?: boolean;
  subscriptionStatus?: string;
};

export async function upsertUserProfile(input: UpsertUserProfileInput) {
  const payload: Record<string, unknown> = {
    uid: input.uid,
    email: input.email,
    updatedAt: serverTimestamp(),
  };

  if (input.displayName) payload.displayName = input.displayName;
  if (input.plan) payload.plan = input.plan;
  if (typeof input.hasPlusAccess === "boolean") {
    payload.hasPlusAccess = input.hasPlusAccess;
  }
  if (typeof input.subscriptionStatus === "string") {
    payload.subscriptionStatus = input.subscriptionStatus;
  }

  await setDoc(doc(db, "users", input.uid), payload, { merge: true });
}
