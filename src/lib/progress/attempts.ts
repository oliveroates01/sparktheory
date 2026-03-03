import {
  ELECTRICAL_LEVEL2_CATEGORIES,
  ELECTRICAL_LEVEL3_CATEGORIES,
} from "@/data/electricalTopicCategories";

export type QuizMode = "practice" | "weak" | "exam" | "flashcards";

export type QuizAttempt = {
  id: string;
  createdAt: string;
  trade: "electrical";
  level: "2" | "3";
  mode: QuizMode;
  topicKey: string;
  scorePercent: number;
  totalQuestions: number;
  correctCount: number;
  durationSec?: number;
};

const ATTEMPTS_CAP = 200;
const MASTERY_QUESTION_WINDOW = 25;

function scopedAttemptsKey(baseKey: string, userId?: string | null) {
  return userId ? `${baseKey}__uid_${userId}` : baseKey;
}

export function getAttemptsKey(
  trade: "electrical",
  level: "2" | "3",
  userId?: string | null
) {
  return scopedAttemptsKey(`qm_attempts_${trade}_${level}`, userId);
}

export function loadAttempts(key: string): QuizAttempt[] {
  try {
    const raw = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(raw) ? (raw as QuizAttempt[]) : [];
  } catch {
    return [];
  }
}

export function appendAttempt(key: string, attempt: QuizAttempt): QuizAttempt[] {
  try {
    const existing = loadAttempts(key);
    const next = [attempt, ...existing].slice(0, ATTEMPTS_CAP);
    localStorage.setItem(key, JSON.stringify(next));
    return next;
  } catch {
    return [];
  }
}

export function createAttemptId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `att_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

type MasteryParams = {
  trade: "electrical";
  level: "2" | "3";
  userId?: string | null;
};

type WeakTopicsParams = MasteryParams & {
  count?: number;
};
type StreakParams = {
  trade: "electrical";
  level: "2" | "3";
  userId?: string | null;
};
type PassProbabilityParams = StreakParams;

export type PassProbabilityStats = {
  probability: number;
  averageScore: number;
  trend: number;
  consistency: number;
  sampleSize: number;
};

function masteryFromAttempts(attempts: QuizAttempt[], questionWindow = MASTERY_QUESTION_WINDOW) {
  if (attempts.length === 0) return null;
  let totalQuestions = 0;
  let totalCorrect = 0;

  for (const attempt of attempts) {
    if (!Number.isFinite(attempt.totalQuestions) || !Number.isFinite(attempt.correctCount)) {
      continue;
    }
    if (attempt.totalQuestions <= 0) continue;

    const remaining = questionWindow - totalQuestions;
    if (remaining <= 0) break;

    const useQuestions = Math.min(attempt.totalQuestions, remaining);
    const ratio = attempt.correctCount / attempt.totalQuestions;
    const weightedCorrect = ratio * useQuestions;

    totalQuestions += useQuestions;
    totalCorrect += weightedCorrect;
  }

  if (totalQuestions <= 0) return null;
  return Math.round((totalCorrect / totalQuestions) * 100);
}

export function getMasteryByTopic({
  trade,
  level,
  userId,
}: MasteryParams): Record<string, number> {
  const key = getAttemptsKey(trade, level, userId);
  const attempts = loadAttempts(key);
  const byTopic = new Map<string, QuizAttempt[]>();

  for (const attempt of attempts) {
    if (attempt.trade !== trade || attempt.level !== level) continue;
    const topic = (attempt.topicKey || "").trim().toLowerCase();
    if (!topic) continue;
    const existing = byTopic.get(topic) || [];
    existing.push(attempt);
    byTopic.set(topic, existing);
  }

  const mastery: Record<string, number> = {};
  for (const [topic, topicAttempts] of byTopic.entries()) {
    const avg = masteryFromAttempts(topicAttempts);
    if (avg !== null) mastery[topic] = avg;
  }

  const mixedKey = level === "3" ? "all-level-3" : "all-level-2";
  const mixedAttempts = attempts.filter(
    (attempt) => attempt.trade === trade && attempt.level === level
  );
  const mixedAvg = masteryFromAttempts(mixedAttempts);
  if (mixedAvg !== null) mastery[mixedKey] = mixedAvg;

  return mastery;
}

function topicFromQuizHref(href?: string) {
  if (!href) return "";
  const q = href.split("?")[1] || "";
  const sp = new URLSearchParams(q);
  return (sp.get("topic") || "").trim().toLowerCase();
}

function fallbackTopicsForLevel(level: "2" | "3", count: number) {
  const categories =
    level === "3" ? ELECTRICAL_LEVEL3_CATEGORIES : ELECTRICAL_LEVEL2_CATEGORIES;
  return categories
    .map((category) => topicFromQuizHref(category.href))
    .filter(Boolean)
    .filter((topic) => topic !== "all-level-2" && topic !== "all-level-3")
    .slice(0, count);
}

export function getWeakTopics({
  trade,
  level,
  userId,
  count = 2,
}: WeakTopicsParams): string[] {
  const mastery = getMasteryByTopic({ trade, level, userId });
  const ranked = Object.entries(mastery)
    .filter(([topic]) => topic !== "all-level-2" && topic !== "all-level-3")
    .sort((a, b) => a[1] - b[1])
    .map(([topic]) => topic);

  if (ranked.length >= count) return ranked.slice(0, count);

  const fallback = fallbackTopicsForLevel(level, count);
  const merged = [...ranked];
  for (const topic of fallback) {
    if (merged.includes(topic)) continue;
    merged.push(topic);
    if (merged.length >= count) break;
  }
  return merged.slice(0, count);
}

function toLondonDayKey(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function previousDayKey(dayKey: string) {
  const [year, month, day] = dayKey.split("-").map(Number);
  if (!year || !month || !day) return "";
  const d = new Date(Date.UTC(year, month - 1, day));
  d.setUTCDate(d.getUTCDate() - 1);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

export function getStreakDays({ trade, level, userId }: StreakParams) {
  const key = getAttemptsKey(trade, level, userId);
  const attempts = loadAttempts(key);
  const daySet = new Set(
    attempts
      .map((attempt) => toLondonDayKey(attempt.createdAt))
      .filter(Boolean)
  );
  if (daySet.size === 0) return 0;

  const todayKey = toLondonDayKey(new Date().toISOString());
  if (!todayKey || !daySet.has(todayKey)) return 0;

  let streak = 0;
  let cursor = todayKey;
  while (daySet.has(cursor)) {
    streak += 1;
    cursor = previousDayKey(cursor);
    if (!cursor) break;
  }
  return streak;
}

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((acc, value) => acc + value, 0) / values.length;
}

function stdDev(values: number[]) {
  if (values.length <= 1) return 0;
  const mu = average(values);
  const variance =
    values.reduce((acc, value) => acc + (value - mu) * (value - mu), 0) / values.length;
  return Math.sqrt(Math.max(0, variance));
}

export function getPassProbability({
  trade,
  level,
  userId,
}: PassProbabilityParams): PassProbabilityStats | null {
  const key = getAttemptsKey(trade, level, userId);
  const recent = loadAttempts(key)
    .filter(
      (attempt) =>
        attempt.trade === trade &&
        attempt.level === level &&
        Number.isFinite(attempt.scorePercent) &&
        attempt.mode !== "flashcards"
    )
    .slice(0, 10);

  if (recent.length === 0) return null;

  const scores = recent.map((attempt) => attempt.scorePercent);
  const recent5 = scores.slice(0, 5);
  const prev5 = scores.slice(5, 10);
  const avgScore = average(scores);
  const trend = prev5.length > 0 ? average(recent5) - average(prev5) : 0;
  const consistency = stdDev(scores);

  let conservative = avgScore + trend * 0.4 - consistency * 0.7 - 5;
  if (scores.length < 3) conservative -= 8;
  else if (scores.length < 6) conservative -= 4;
  const probability = Math.round(Math.max(0, Math.min(100, conservative)));

  return {
    probability,
    averageScore: Math.round(avgScore),
    trend: Math.round(trend * 10) / 10,
    consistency: Math.round(consistency * 10) / 10,
    sampleSize: scores.length,
  };
}
