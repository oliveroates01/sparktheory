import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type ProgressRecord = {
  label?: unknown;
  score?: unknown;
  topic?: unknown;
  date?: unknown;
  correct?: unknown;
  total?: unknown;
  type?: unknown;
};

const STORAGE_BASE_KEYS = ["qm_results_v1", "qm_results_v1_level3"] as const;

function scopedProgressKey(baseKey: string, userId?: string | null) {
  return userId ? `${baseKey}__uid_${userId}` : baseKey;
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function loadProgressRecords(key: string): ProgressRecord[] {
  try {
    const raw = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(raw) ? (raw as ProgressRecord[]) : [];
  } catch {
    return [];
  }
}

function recordIdentity(rec: ProgressRecord) {
  const label = typeof rec.label === "string" ? rec.label : "";
  const score = toNumber(rec.score) ?? 0;
  const topic = typeof rec.topic === "string" ? rec.topic : "";
  const date = typeof rec.date === "string" ? rec.date : "";
  const correct = toNumber(rec.correct) ?? -1;
  const total = toNumber(rec.total) ?? -1;
  return `${label}|${score}|${topic}|${date}|${correct}|${total}`;
}

function pointsFromRecord(rec: ProgressRecord): number {
  const total = Math.max(0, toNumber(rec.total) ?? 0);
  const scorePercent = Math.max(0, Math.min(100, toNumber(rec.score) ?? 0));
  const explicitCorrect = toNumber(rec.correct);
  const correct =
    explicitCorrect !== null && explicitCorrect >= 0
      ? explicitCorrect
      : total > 0
      ? Math.round((total * scorePercent) / 100)
      : 0;
  const safeCorrect = Math.max(0, Math.round(correct));
  return safeCorrect * 10 + 25;
}

function computeBackfillPoints(userId: string): number {
  const keys = STORAGE_BASE_KEYS.flatMap((base) => [
    scopedProgressKey(base, userId),
    base,
  ]);
  const seen = new Set<string>();
  let total = 0;

  for (const key of keys) {
    const records = loadProgressRecords(key);
    for (const rec of records) {
      if (rec.type && rec.type !== "practice") continue;
      const id = recordIdentity(rec);
      if (seen.has(id)) continue;
      seen.add(id);
      total += pointsFromRecord(rec);
    }
  }

  return Math.max(0, Math.round(total));
}

export async function backfillLeaderboardPointsFromLocalProgress(userId: string) {
  if (!userId || typeof window === "undefined") return;

  const computedPoints = computeBackfillPoints(userId);
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  const data = userSnap.exists() ? userSnap.data() || {} : {};

  const currentPointsRaw = data.points;
  const currentPoints =
    typeof currentPointsRaw === "number" && Number.isFinite(currentPointsRaw)
      ? currentPointsRaw
      : 0;
  const alreadyBackfilled = data.pointsBackfilled === true;

  if (alreadyBackfilled) return;
  if (computedPoints <= 0) return;

  const nextPoints = Math.max(currentPoints, computedPoints);

  if (nextPoints === currentPoints) {
    await setDoc(
      userRef,
      {
        pointsBackfilled: true,
        pointsBackfilledAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return;
  }

  await setDoc(
    userRef,
    {
      points: nextPoints,
      pointsBackfilled: true,
      pointsBackfilledAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
