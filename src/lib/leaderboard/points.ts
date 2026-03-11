import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function getStreakMultiplier(streakDays: number): number {
  if (streakDays >= 7) return 1.35;
  if (streakDays === 6) return 1.3;
  if (streakDays === 5) return 1.25;
  if (streakDays === 4) return 1.2;
  if (streakDays === 3) return 1.15;
  if (streakDays === 2) return 1.1;
  return 1.0;
}

export function applyStreakMultiplier(basePoints: number, streakDays: number): number {
  const safeBase = Number.isFinite(basePoints) ? Math.max(0, basePoints) : 0;
  const multiplier = getStreakMultiplier(streakDays);
  return Math.round(safeBase * multiplier);
}

type AwardPointsInput = {
  uid: string;
  basePoints: number;
  streakDays: number;
};

export async function awardLeaderboardPoints({
  uid,
  basePoints,
  streakDays,
}: AwardPointsInput): Promise<{ awardedPoints: number; multiplier: number }> {
  const awardedPoints = applyStreakMultiplier(basePoints, streakDays);
  const multiplier = getStreakMultiplier(streakDays);

  if (!uid || awardedPoints <= 0) {
    return { awardedPoints: 0, multiplier };
  }

  const userRef = doc(db, "users", uid);
  await runTransaction(db, async (tx) => {
    const userSnap = await tx.get(userRef);
    const current = userSnap.exists() ? userSnap.data() : {};
    const currentPointsRaw = current?.points;
    const currentPoints =
      typeof currentPointsRaw === "number" && Number.isFinite(currentPointsRaw)
        ? currentPointsRaw
        : 0;

    tx.set(
      userRef,
      {
        points: currentPoints + awardedPoints,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  });

  return { awardedPoints, multiplier };
}
