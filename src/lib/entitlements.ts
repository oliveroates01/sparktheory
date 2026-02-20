export type ManualOverride = "none" | "plus" | "free";

export type EntitlementFields = {
  hasPlusAccess?: boolean;
  plan?: string;
  subscriptionStatus?: string;
  manualOverride?: string;
};

export function normalizeManualOverride(value: unknown): ManualOverride {
  const raw = typeof value === "string" ? value.toLowerCase().trim() : "";
  if (raw === "plus") return "plus";
  if (raw === "free") return "free";
  return "none";
}

export function resolvePlusAccess(fields: EntitlementFields): boolean {
  const manualOverride = normalizeManualOverride(fields.manualOverride);
  if (manualOverride === "plus") return true;
  if (manualOverride === "free") return false;

  const hasPlus = Boolean(fields.hasPlusAccess);
  const plan = (fields.plan || "").toUpperCase();
  const subscriptionStatus = (fields.subscriptionStatus || "").toLowerCase();
  return hasPlus || (plan === "PLUS" && subscriptionStatus === "active");
}

