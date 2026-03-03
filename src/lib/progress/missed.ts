export type MissedEntry = {
  missedCount: number;
  lastSelectedOptionId?: string;
  lastSelectedOptionText?: string;
  lastAttemptAt: number;
};

export type MissedMap = Record<string, MissedEntry>;

function scopedKey(baseKey: string, userId?: string | null) {
  return userId ? `${baseKey}__uid_${userId}` : baseKey;
}

export function getMissedKey(
  trade: "electrical",
  level: "2" | "3",
  userId?: string | null
) {
  return scopedKey(`qm_missed_v1:${trade}:${level}`, userId);
}

export function loadMissedMap(key: string): MissedMap {
  try {
    const raw = JSON.parse(localStorage.getItem(key) || "{}");
    if (!raw || typeof raw !== "object") return {};
    const out: MissedMap = {};
    for (const [questionId, value] of Object.entries(raw as Record<string, unknown>)) {
      if (typeof value === "number") {
        out[questionId] = {
          missedCount: Number(value) || 0,
          lastAttemptAt: 0,
        };
        continue;
      }
      if (!value || typeof value !== "object") continue;
      const typed = value as Partial<MissedEntry>;
      out[questionId] = {
        missedCount: Number.isFinite(typed.missedCount) ? Number(typed.missedCount) : 0,
        lastSelectedOptionId:
          typeof typed.lastSelectedOptionId === "string" && typed.lastSelectedOptionId.trim()
            ? typed.lastSelectedOptionId
            : undefined,
        lastSelectedOptionText:
          typeof typed.lastSelectedOptionText === "string" && typed.lastSelectedOptionText.trim()
            ? typed.lastSelectedOptionText
            : undefined,
        lastAttemptAt:
          Number.isFinite(typed.lastAttemptAt) && Number(typed.lastAttemptAt) > 0
            ? Number(typed.lastAttemptAt)
            : 0,
      };
    }
    return out;
  } catch {
    return {};
  }
}

export function saveMissedMap(key: string, map: MissedMap) {
  try {
    localStorage.setItem(key, JSON.stringify(map));
  } catch {
    // ignore
  }
}

export function recordMissedQuestions(params: {
  trade: "electrical";
  level: "2" | "3";
  userId?: string | null;
  misses: Array<{
    questionId: string;
    lastSelectedOptionId?: string;
    lastSelectedOptionText?: string;
  }>;
}) {
  const { trade, level, userId, misses } = params;
  const key = getMissedKey(trade, level, userId);
  const map = loadMissedMap(key);
  for (const miss of misses) {
    const id = miss.questionId;
    if (!id) continue;
    const previous = map[id]?.missedCount ?? 0;
    map[id] = {
      missedCount: previous + 1,
      lastSelectedOptionId: miss.lastSelectedOptionId,
      lastSelectedOptionText: miss.lastSelectedOptionText,
      lastAttemptAt: Date.now(),
    };
  }
  saveMissedMap(key, map);
  return map;
}
