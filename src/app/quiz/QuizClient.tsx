"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { addDoc, collection, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth } from "@/lib/firebase";
import { db } from "@/lib/firebase";
import { normalizeManualOverride, resolvePlusAccess } from "@/lib/entitlements";
import {
  appendAttempt,
  createAttemptId,
  getAttemptsKey,
  getStreakDays,
  getWeakTopics,
  loadAttempts,
} from "@/lib/progress/attempts";
import { recordMissedQuestions } from "@/lib/progress/missed";
import { awardLeaderboardPoints } from "@/lib/leaderboard/points";

import { type StoredResult } from "@/components/ProgressReport";

import { healthSafetyQuestions } from "@/data/healthSafety";
import { principlesElectricalScienceQuestions } from "@/data/principlesElectricalScience";
import { principlesElectricalScienceLevel3Questions } from "@/data/principlesElectricalScienceLevel3";
import { electricalInstallationTechnologyQuestions } from "@/data/ElectricalInstallationTechnology";
import { installationWiringQuestions } from "@/data/installationWiring";
import { communicationWithinBSEQuestions } from "@/data/communicationWithinBSE";
import { electricalTechnologyLevel3Questions } from "@/data/electricalTechnologyLevel3";
import { inspectionTestingCommissioningLevel3Questions } from "@/data/inspectionTestingCommissioningLevel3";
import {
  ELECTRICAL_LEVEL2_CATEGORIES,
  ELECTRICAL_LEVEL3_CATEGORIES,
} from "@/data/electricalTopicCategories";

type Question = {
  id: string;
  legacyIds?: string[];
  topic?: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
};

type ProblemStat = {
  wrong: number;
  total: number;
  lastPickedOptionIndex?: number;
  questionText?: string;
  selectedOptionId?: string;
  selectedOptionText?: string;
  correctOptionId?: string;
  missedCount?: number;
};

type ProblemStats = Record<string, ProblemStat>;
type QuestionTopicMeta = {
  slug: string;
  title: string;
};
type FlashcardTopicOption = { key: string; label: string; level: "2" | "3" };

const STORAGE_KEY_LEVEL2 = "qm_results_v1";
const STORAGE_KEY_LEVEL3 = "qm_results_v1_level3";
const DEFAULT_QUIZ_SIZE = 4;
const WEAK_COUNT = 5;
const PLUS_ACCESS_CACHE_PREFIX = "qm_plus_access_";
const QUESTION_ID_MIGRATION_MAP: Record<string, string> = {
  "hs-051": "hs-071",
  "hs-052": "hs-072",
  "hs-053": "hs-073",
  "hs-054": "hs-074",
  "hs-055": "hs-075",
  "hs-056": "hs-076",
  "hs-057": "hs-077",
  "hs-058": "hs-078",
  "hs-059": "hs-079",
  "hs-060": "hs-080",
  "hs-061": "hs-081",
  "hs-062": "hs-082",
  "hs-063": "hs-083",
  "hs-064": "hs-084",
  "hs-065": "hs-085",
  "hs-066": "hs-086",
  "hs-067": "hs-087",
  "hs-068": "hs-088",
  "hs-069": "hs-089",
  "hs-070": "hs-090",
};

const LOCKED_LEVEL2_TOPICS = new Set([
  "electrical-installation-technology",
  "installation-wiring-systems-enclosures",
  "communication-within-building-services-engineering",
]);

const LOCKED_LEVEL3_TOPICS = new Set([
  "all-level-3",
  "electrical-technology",
  "inspection-testing-commissioning",
]);

function scopedProgressKey(baseKey: string, userId?: string | null) {
  return userId ? `${baseKey}__uid_${userId}` : baseKey;
}

function storageKeyForLevel(level: string, userId?: string | null) {
  const baseKey = level === "3" ? STORAGE_KEY_LEVEL3 : STORAGE_KEY_LEVEL2;
  return scopedProgressKey(baseKey, userId);
}

function seenKeyForTopic(level: string, topic: string, userId?: string | null) {
  const safeTopic = topic || "unknown";
  const baseKey = `qm_seen_${level === "3" ? "3" : "2"}_${safeTopic}`;
  return scopedProgressKey(baseKey, userId);
}

function problemKeyForTopic(level: string, topic: string, userId?: string | null) {
  const safeTopic = topic || "unknown";
  const baseKey = `qm_problem_${level === "3" ? "3" : "2"}_${safeTopic}`;
  return scopedProgressKey(baseKey, userId);
}

function canonicalQuestionId(id: string): string {
  return QUESTION_ID_MIGRATION_MAP[id] ?? id;
}

function loadSeenIds(key: string): Set<string> {
  try {
    const raw = JSON.parse(localStorage.getItem(key) || "[]");
    if (!Array.isArray(raw)) return new Set();
    return new Set(
      raw
        .filter((x): x is string => typeof x === "string")
        .map((id) => canonicalQuestionId(id))
    );
  } catch {
    return new Set();
  }
}

function saveSeenIds(key: string, ids: Set<string>) {
  try {
    localStorage.setItem(key, JSON.stringify([...ids]));
  } catch {
    // ignore
  }
}

function loadProblemStats(key: string): ProblemStats {
  try {
    const raw = JSON.parse(localStorage.getItem(key) || "{}");
    if (!raw || typeof raw !== "object") return {};
      const migrated: ProblemStats = {};
      for (const [id, stat] of Object.entries(raw as Record<string, unknown>)) {
        if (!stat || typeof stat !== "object") continue;
        const typed = stat as Partial<ProblemStat>;
        const nextId = canonicalQuestionId(id);
      const existing = migrated[nextId] || { wrong: 0, total: 0 };
        migrated[nextId] = {
          wrong: existing.wrong + (Number.isFinite(typed.wrong) ? Number(typed.wrong) : 0),
          total: existing.total + (Number.isFinite(typed.total) ? Number(typed.total) : 0),
          lastPickedOptionIndex: Number.isFinite(typed.lastPickedOptionIndex)
            ? Number(typed.lastPickedOptionIndex)
            : existing.lastPickedOptionIndex,
          questionText:
            typeof typed.questionText === "string" && typed.questionText.trim()
              ? typed.questionText
              : existing.questionText,
          selectedOptionId:
            typeof typed.selectedOptionId === "string" && typed.selectedOptionId.trim()
              ? typed.selectedOptionId
              : existing.selectedOptionId,
          selectedOptionText:
            typeof typed.selectedOptionText === "string" && typed.selectedOptionText.trim()
              ? typed.selectedOptionText
              : existing.selectedOptionText,
          correctOptionId:
            typeof typed.correctOptionId === "string" && typed.correctOptionId.trim()
              ? typed.correctOptionId
              : existing.correctOptionId,
          missedCount: Number.isFinite(typed.missedCount)
            ? Number(typed.missedCount)
            : existing.missedCount,
        };
      }
      return migrated;
  } catch {
    return {};
  }
}

function saveProblemStats(key: string, stats: ProblemStats) {
  try {
    localStorage.setItem(key, JSON.stringify(stats));
  } catch {
    // ignore
  }
}

function loadAllResults(storageKey: string): StoredResult[] {
  try {
    const raw = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return Array.isArray(raw) ? (raw as StoredResult[]) : [];
  } catch {
    return [];
  }
}

function saveQuizResult(storageKey: string, result: StoredResult) {
  try {
    const existing = loadAllResults(storageKey);
    existing.push(result);

    // keep last 50
    const trimmed =
      existing.length > 50 ? existing.slice(existing.length - 50) : existing;

    localStorage.setItem(storageKey, JSON.stringify(trimmed));
  } catch {
    // ignore
  }
}

function shuffle<T>(arr: T[]) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickRandom<T>(arr: T[], count: number): T[] {
  if (count <= 0 || arr.length === 0) return [];
  return shuffle(arr).slice(0, Math.min(count, arr.length));
}

function toNumber(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function toStringArray4(v: unknown): [string, string, string, string] | null {
  if (!Array.isArray(v)) return null;
  if (v.length !== 4) return null;
  const out = v.map((x) => (typeof x === "string" ? x.trim() : ""));
  if (out.some((s) => !s)) return null;
  return out as [string, string, string, string];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeQuestion(raw: unknown, index: number): Question | null {
  if (!isRecord(raw)) return null;

  const id = typeof raw.id === "string" ? raw.id : `q-${index + 1}`;
  const legacyIds = Array.isArray(raw.legacyIds)
    ? raw.legacyIds
        .filter((x): x is string => typeof x === "string")
        .map((x) => x.trim())
        .filter((x) => x && x !== id)
    : [];
  const question = typeof raw.question === "string" ? raw.question : "";
  const options = toStringArray4(raw.options);
  const correctIndex = toNumber(raw.correctIndex);
  const explanation =
    typeof raw.explanation === "string"
      ? raw.explanation
      : "No explanation yet.";

  if (!question || !options || correctIndex === null) return null;
  if (correctIndex < 0 || correctIndex > 3) return null;

  return {
    id,
    legacyIds: legacyIds.length > 0 ? legacyIds : undefined,
    topic:
      typeof raw.topic === "string" && raw.topic.trim()
        ? raw.topic.trim().toLowerCase()
        : inferTopicSlugFromQuestionId(id),
    question,
    options,
    correctIndex,
    explanation,
  };
}

function inferTopicSlugFromQuestionId(id: string): string | undefined {
  if (id.startsWith("hs-")) return "health-safety";
  if (id.startsWith("pes-")) return "principles-electrical-science";
  if (id.startsWith("eit-")) return "electrical-installation-technology";
  if (id.startsWith("iwse-")) return "installation-wiring-systems-enclosures";
  if (id.startsWith("comm-")) return "communication-within-building-services-engineering";
  if (id.startsWith("et3-")) return "electrical-technology";
  if (id.startsWith("itc3-")) return "inspection-testing-commissioning";
  if (id.startsWith("pes3-")) return "principles-electrical-science";
  return undefined;
}

function enforceTopicSlug(questions: Question[], topicSlug: string): Question[] {
  return questions.filter((q) => q.topic === topicSlug);
}

function dedupeQuestionsById(questions: Question[]): Question[] {
  const seen = new Set<string>();
  const deduped: Question[] = [];
  for (const q of questions) {
    if (seen.has(q.id)) continue;
    seen.add(q.id);
    deduped.push(q);
  }
  return deduped;
}

function allQuestionIds(q: Question): string[] {
  return q.legacyIds ? [q.id, ...q.legacyIds] : [q.id];
}

function mergedProblemStat(stats: ProblemStats, q: Question): ProblemStat {
  const ids = allQuestionIds(q);
  return ids.reduce(
    (acc, id) => {
      const s = stats[id];
      if (!s) return acc;
      return {
        wrong: acc.wrong + (Number.isFinite(s.wrong) ? s.wrong : 0),
        total: acc.total + (Number.isFinite(s.total) ? s.total : 0),
      };
    },
    { wrong: 0, total: 0 }
  );
}

function hasSeenQuestion(seen: Set<string>, q: Question): boolean {
  return allQuestionIds(q).some((id) => seen.has(id));
}

function shuffleQuestionOptions(q: Question): Question {
  const paired = q.options.map((text, originalIndex) => ({ text, originalIndex }));
  const shuffled = shuffle(paired);
  const newCorrectIndex = shuffled.findIndex(
    (p) => p.originalIndex === q.correctIndex
  );

  return {
    ...q,
    options: shuffled.map((p) => p.text) as [string, string, string, string],
    correctIndex: newCorrectIndex,
  };
}

function topicTitle(topic: string) {
  return topic === "all-level-2"
    ? "Level 2 Mixed Quiz"
    : topic === "all-level-3"
    ? "Level 3 Mixed Quiz"
    : topic === "principles-electrical-science"
    ? "Principles of Electrical Science Quiz"
    : topic === "electrical-technology"
    ? "Electrical Technology Quiz"
    : topic === "inspection-testing-commissioning"
    ? "Inspection, Testing & Commissioning Quiz"
    : topic === "electrical-installation-technology"
    ? "Electrical Installation Technology Quiz"
    : topic === "installation-wiring-systems-enclosures"
    ? "Installation of Wiring Systems & Enclosures Quiz"
    : topic === "communication-within-building-services-engineering"
    ? "Communication within Building Services Engineering Quiz"
    : "Health & Safety Quiz";
}

function topicTitlePlain(topic: string) {
  return topic === "principles-electrical-science"
    ? "Principles of Electrical Science"
    : topic === "electrical-technology"
    ? "Electrical Technology"
    : topic === "inspection-testing-commissioning"
    ? "Inspection, Testing & Commissioning"
    : topic === "electrical-installation-technology"
    ? "Electrical Installation Technology"
    : topic === "installation-wiring-systems-enclosures"
    ? "Installation Wiring Systems & Enclosures"
    : topic === "communication-within-building-services-engineering"
    ? "Communication within BSE"
    : "Health & Safety";
}

function topicCatalogForLevel(level: string): QuestionTopicMeta[] {
  if (level === "3") {
    return [
      { slug: "principles-electrical-science", title: "Principles of Electrical Science" },
      { slug: "electrical-technology", title: "Electrical Technology" },
      { slug: "inspection-testing-commissioning", title: "Inspection, Testing & Commissioning" },
    ];
  }
  return [
    { slug: "health-safety", title: "Health & Safety" },
    { slug: "principles-electrical-science", title: "Principles of Electrical Science" },
    { slug: "electrical-installation-technology", title: "Electrical Installation Technology" },
    { slug: "installation-wiring-systems-enclosures", title: "Installation Wiring Systems & Enclosures" },
    { slug: "communication-within-building-services-engineering", title: "Communication within BSE" },
  ];
}

function topicFromHref(href?: string) {
  if (!href) return "";
  const query = href.split("?")[1] || "";
  const params = new URLSearchParams(query);
  return (params.get("topic") || "").trim().toLowerCase();
}

function flashcardOptionsFromCategories(
  categories: Array<{ href?: string; title: string }>,
  level: "2" | "3"
): FlashcardTopicOption[] {
  return categories
    .map((category) => ({
      key: topicFromHref(category.href),
      label: category.title.includes("Mixed")
        ? level === "3"
          ? "Level 3 Mixed"
          : "Level 2 Mixed"
        : category.title,
      level,
    }))
    .filter((option) => Boolean(option.key));
}

function rawBankForTopic(topic: string, level: string): unknown[] {
  if (topic === "all-level-2") {
    return [
      ...(healthSafetyQuestions as unknown[]),
      ...(principlesElectricalScienceQuestions as unknown[]),
      ...(electricalInstallationTechnologyQuestions as unknown[]),
      ...(installationWiringQuestions as unknown[]),
      ...(communicationWithinBSEQuestions as unknown[]),
    ];
  }
  if (topic === "all-level-3") {
    return [
      ...(principlesElectricalScienceLevel3Questions as unknown[]),
      ...(electricalTechnologyLevel3Questions as unknown[]),
      ...(inspectionTestingCommissioningLevel3Questions as unknown[]),
    ];
  }
  if (topic === "principles-electrical-science") {
    return level === "3"
      ? (principlesElectricalScienceLevel3Questions as unknown[])
      : (principlesElectricalScienceQuestions as unknown[]);
  }
  if (topic === "electrical-technology") {
    return level === "3"
      ? (electricalTechnologyLevel3Questions as unknown[])
      : (electricalInstallationTechnologyQuestions as unknown[]);
  }
  if (topic === "inspection-testing-commissioning") {
    return level === "3"
      ? (inspectionTestingCommissioningLevel3Questions as unknown[])
      : (installationWiringQuestions as unknown[]);
  }
  if (topic === "electrical-installation-technology") {
    return electricalInstallationTechnologyQuestions as unknown[];
  }
  if (topic === "installation-wiring-systems-enclosures") {
    return installationWiringQuestions as unknown[];
  }
  if (topic === "communication-within-building-services-engineering") {
    return communicationWithinBSEQuestions as unknown[];
  }
  return healthSafetyQuestions as unknown[];
}

export default function QuizPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [hasPlusAccess, setHasPlusAccess] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [subscriptionReady, setSubscriptionReady] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [entitlementsLoading, setEntitlementsLoading] = useState(true);

  const topic = (searchParams.get("topic") ?? "").trim().toLowerCase();
  const trade = (searchParams.get("trade") ?? "electrical").trim().toLowerCase() || "electrical";
  const modeParam = (searchParams.get("mode") ?? "").trim().toLowerCase();

  useEffect(() => {
    const loadSubscription = async (user: User) => {
      if (!user.email) {
        setHasPlusAccess(false);
        setSubscriptionReady(true);
        return;
      }
      let plusFromStripe = false;
      let plusFromProfile = false;
      try {
        const token = await user.getIdToken();
        const response = await fetch("/api/stripe/subscription-status", {
          method: "POST",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email: user.email, uid: user.uid }),
        });
        const result = (await response.json().catch(() => ({}))) as {
          isSubscribed?: boolean;
          hasPlusAccess?: boolean;
          hasSubscription?: boolean;
        };
        plusFromStripe = Boolean(
          result.isSubscribed ?? result.hasPlusAccess ?? result.hasSubscription
        );
      } catch {
        // Keep cached/previous value on transient errors.
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const profile = userDoc.data() as
          | {
              hasPlusAccess?: boolean;
              plan?: string;
              subscriptionStatus?: string;
              manualOverride?: string;
            }
          | undefined;
        plusFromProfile = resolvePlusAccess({
          hasPlusAccess: Boolean(profile?.hasPlusAccess),
          plan: String(profile?.plan || "FREE"),
          subscriptionStatus: String(profile?.subscriptionStatus || "none"),
          manualOverride: normalizeManualOverride(profile?.manualOverride),
        });
      } catch {
        // Ignore profile lookup errors.
      }

      try {
        const plus = plusFromStripe || plusFromProfile;
        setHasPlusAccess(plus);
        try {
          localStorage.setItem(`${PLUS_ACCESS_CACHE_PREFIX}${user.uid}`, plus ? "1" : "0");
        } catch {
          // ignore cache failures
        }
      } finally {
        setSubscriptionReady(true);
        setEntitlementsLoading(false);
      }
    };

    const unsub = onAuthStateChanged(auth, (user) => {
      setAuthLoading(false);
      setUserLoggedIn(Boolean(user));
      setCurrentUserId(user?.uid ?? null);
      setAuthReady(true);
      if (!user) {
        setHasPlusAccess(false);
        setSubscriptionReady(true);
        setEntitlementsLoading(false);
        return;
      }
      try {
        const cached = localStorage.getItem(`${PLUS_ACCESS_CACHE_PREFIX}${user.uid}`);
        if (cached === "1") {
          setHasPlusAccess(true);
        }
      } catch {
        // ignore cache failures
      }
      setSubscriptionReady(false);
      setEntitlementsLoading(true);
      void loadSubscription(user);
    });
    return () => unsub();
  }, []);
  const level = (searchParams.get("level") ?? "").trim();
  const normalizedLevel: "2" | "3" = level === "3" ? "3" : "2";
  const currentTopicKey = topic || `all-level-${normalizedLevel}`;
  const quizMode: "practice" | "weak" | "flashcards" =
    modeParam === "weak"
      ? "weak"
      : modeParam === "flashcards"
      ? "flashcards"
      : "practice";
  const weakTopics = useMemo(
    () =>
      (searchParams.get("topics") ?? "")
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
    [searchParams]
  );
  const problemsOnly = false;
  const storageKey = storageKeyForLevel(level, currentUserId);
  const flashcardsCountRaw = (searchParams.get("count") ?? "").trim();
  const hasFlashcardsCountParam = searchParams.has("count");
  const flashcardsCount = flashcardsCountRaw === "10" ? 10 : 5;
  const nRaw = (searchParams.get("n") ?? "").trim();
  const quizSize =
    Number.isFinite(Number(nRaw)) && Number(nRaw) > 0
      ? Number(nRaw)
      : DEFAULT_QUIZ_SIZE;

  const quizTitle =
    quizMode === "weak"
      ? "Weak Areas Quiz"
      : quizMode === "flashcards"
      ? "Flashcards"
      : topicTitle(topic);
  const flashcardLevel2Options = useMemo(
    () => flashcardOptionsFromCategories(ELECTRICAL_LEVEL2_CATEGORIES, "2"),
    []
  );
  const flashcardLevel3Options = useMemo(
    () => flashcardOptionsFromCategories(ELECTRICAL_LEVEL3_CATEGORIES, "3"),
    []
  );
  const flashcardTopicOptions = useMemo(
    () => [...flashcardLevel2Options, ...flashcardLevel3Options],
    [flashcardLevel2Options, flashcardLevel3Options]
  );
  const flashcardTopicKeys = useMemo(
    () => new Set(flashcardTopicOptions.map((option) => option.key)),
    [flashcardTopicOptions]
  );
  const flashcardLevel3Keys = useMemo(
    () => new Set(flashcardLevel3Options.map((option) => option.key)),
    [flashcardLevel3Options]
  );
  const hasValidFlashTopic = topic ? flashcardTopicKeys.has(topic) : false;
  const flashcardsNeedsSetup =
    quizMode === "flashcards" &&
    (!hasValidFlashTopic || !hasFlashcardsCountParam);
  const [setupSelectedLevel, setSetupSelectedLevel] = useState<"2" | "3">("2");
  const [setupSelectedTopicKey, setSetupSelectedTopicKey] = useState("all-level-2");
  const [setupSelectedCount, setSetupSelectedCount] = useState<5 | 10>(5);
  const topicsHref =
    level === "3" ? "/trade/electrical?level=3" : "/trade/electrical";
  const backToFlashcardsHref = `/quiz?trade=${trade}&mode=flashcards&level=${normalizedLevel}&topic=${currentTopicKey}&count=${flashcardsCount}`;
  const unseenOnly = (searchParams.get("unseen") ?? "").trim() === "1";
  const weakRequiresPlus =
    quizMode === "weak" &&
    weakTopics.some((weakTopic) =>
      level === "3"
        ? LOCKED_LEVEL3_TOPICS.has(weakTopic)
        : LOCKED_LEVEL2_TOPICS.has(weakTopic)
    );
  const requiresPlusTopic =
    quizMode === "flashcards" ||
    weakRequiresPlus ||
    (level === "3" && LOCKED_LEVEL3_TOPICS.has(topic)) ||
    (level !== "3" && LOCKED_LEVEL2_TOPICS.has(topic));
  const accessLoading =
    requiresPlusTopic && (authLoading || entitlementsLoading || !authReady || !subscriptionReady);
  const isLocked =
    requiresPlusTopic && !accessLoading && (!userLoggedIn || !hasPlusAccess);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    console.log("[quiz-access]", {
      pathname,
      uid: auth.currentUser?.uid ?? null,
      topic,
      level,
      userLoggedIn,
      hasPlusAccess,
      authLoading,
      entitlementsLoading,
      authReady,
      subscriptionReady,
      requiresPlusTopic,
      accessLoading,
      isLocked,
    });
  }, [
    pathname,
    topic,
    level,
    userLoggedIn,
    hasPlusAccess,
    authLoading,
    entitlementsLoading,
    authReady,
    subscriptionReady,
    requiresPlusTopic,
    accessLoading,
    isLocked,
  ]);

  useEffect(() => {
    if (!isLocked) return;
    if (process.env.NODE_ENV === "development") {
      console.log("[quiz-access] redirect-branch", {
        pathname,
        uid: auth.currentUser?.uid ?? null,
        branch: userLoggedIn ? "denied-to-account" : "not-logged-in-to-login",
      });
    }
    router.replace(userLoggedIn ? "/account" : "/login");
  }, [isLocked, router, userLoggedIn, pathname]);

  const bank = useMemo<Question[]>(() => {
    const normalizedByTopic = (topicSlug: string): Question[] =>
      (() => {
        const raw = rawBankForTopic(topicSlug, level);
        const normalized = raw
          .map((q, i) => normalizeQuestion(q, i))
          .filter((q): q is Question => Boolean(q));

        if (topicSlug === "all-level-2" || topicSlug === "all-level-3") {
          const deduped = dedupeQuestionsById(normalized);
          if (process.env.NODE_ENV !== "production") {
            console.log("[quiz-mixed-bank]", {
              topic: topicSlug,
              level,
              mergedBankSize: raw.length,
              dedupedSize: deduped.length,
              finalQuizSize: quizSize,
            });
          }
          return deduped;
        }

        return enforceTopicSlug(normalized, topicSlug);
      })();

    if (quizMode === "weak") {
      const resolvedWeakTopics =
        weakTopics.length > 0
          ? weakTopics
          : getWeakTopics({
              trade: "electrical",
              level: level === "3" ? "3" : "2",
              userId: currentUserId,
              count: 2,
            });

      const weakBank = dedupeQuestionsById(
        resolvedWeakTopics.flatMap((weakTopic) => normalizedByTopic(weakTopic))
      );
      const missedPriority = resolvedWeakTopics
        .flatMap((weakTopic) => {
          const statsByTopic = loadProblemStats(
            problemKeyForTopic(level, weakTopic, currentUserId)
          );
          return normalizedByTopic(weakTopic)
            .map((question) => ({
              question,
              wrong: mergedProblemStat(statsByTopic, question).wrong,
            }))
            .filter((entry) => entry.wrong > 0);
        })
        .sort((a, b) => b.wrong - a.wrong)
        .map((entry) => entry.question);

      const seenIds = new Set<string>();
      const prioritized: Question[] = [];
      for (const q of [...missedPriority, ...weakBank]) {
        if (seenIds.has(q.id)) continue;
        seenIds.add(q.id);
        prioritized.push(q);
      }

      const selected = pickRandom(prioritized, WEAK_COUNT);
      if (selected.length >= WEAK_COUNT) return selected;

      const mixedTopicKey = level === "3" ? "all-level-3" : "all-level-2";
      const mixedPool = normalizedByTopic(mixedTopicKey).filter(
        (q) => !selected.some((picked) => picked.id === q.id)
      );
      const fillers = pickRandom(mixedPool, WEAK_COUNT - selected.length);
      return [...selected, ...fillers];
    }

    const normalized = normalizedByTopic(topic);

    if (typeof window === "undefined") return normalized;

    if (problemsOnly && topic) {
      const catalog = topicCatalogForLevel(level);
      const isAllTopics = topic === "all-level-2" || topic === "all-level-3";
      const scopedTopics = isAllTopics
        ? catalog
        : catalog.filter((entry) => entry.slug === topic);
      const mixedKey = isAllTopics
        ? problemKeyForTopic(level, topic, currentUserId)
        : null;
      const seenQuestionIds = new Set<string>();
      const collected: Array<{ question: Question; wrong: number }> = [];

      for (const entry of scopedTopics) {
        const questionsForTopic = normalizedByTopic(entry.slug);
        const statsByTopic = loadProblemStats(
          problemKeyForTopic(level, entry.slug, currentUserId)
        );
        const statsForMixed = mixedKey ? loadProblemStats(mixedKey) : null;

        for (const q of questionsForTopic) {
          if (seenQuestionIds.has(q.id)) continue;
          const topicWrong = mergedProblemStat(statsByTopic, q).wrong;
          const mixedWrong = statsForMixed ? mergedProblemStat(statsForMixed, q).wrong : 0;
          const wrong = topicWrong + mixedWrong;
          if (wrong <= 0) continue;
          seenQuestionIds.add(q.id);
          collected.push({ question: q, wrong });
        }
      }

      return collected
        .sort((a, b) => b.wrong - a.wrong)
        .map((entry) => entry.question);
    }

    if (!unseenOnly || !topic) return normalized;

    const seenKey = seenKeyForTopic(level, topic, currentUserId);
    const seen = loadSeenIds(seenKey);
    if (seen.size === 0) return normalized;

    const unseen = normalized.filter((q) => !hasSeenQuestion(seen, q));
    return unseen.length > 0 ? unseen : normalized;
  }, [topic, level, unseenOnly, problemsOnly, currentUserId, quizMode, weakTopics]);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Array<number | null>>([]);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showProblemsList, setShowProblemsList] = useState(problemsOnly);
  const [problemTopicFilter, setProblemTopicFilter] = useState<string>("all");
  const [revealed, setRevealed] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState<
    "Wrong category" | "Wrong answer" | "Typo" | "Other"
  >("Wrong answer");
  const [reportNote, setReportNote] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportError, setReportError] = useState("");

  // prevent saving twice
  const [hasSaved, setHasSaved] = useState(false);

  // ✅ track quiz start time so we can save "time taken"
  const startedAtMsRef = useRef<number>(Date.now());

  useEffect(() => {
    setShowProblemsList(problemsOnly);
    setProblemTopicFilter("all");
  }, [problemsOnly]);

  useEffect(() => {
    if (showProblemsList) {
      setQuestions([]);
      setCurrentIndex(0);
      setSelected(null);
      setAnswers([]);
      setScore(0);
      setFinished(false);
      setHasSaved(false);
      setRevealed(false);
    }
  }, [showProblemsList]);

  const problemTopicCatalog = useMemo(() => topicCatalogForLevel(level), [level]);

  const questionTopicLookup = useMemo(() => {
    const lookup = new Map<string, QuestionTopicMeta>();
    for (const entry of problemTopicCatalog) {
      const normalized = rawBankForTopic(entry.slug, level)
        .map((q, i) => normalizeQuestion(q, i))
        .filter((q): q is Question => Boolean(q));
      for (const q of normalized) {
        allQuestionIds(q).forEach((id) => lookup.set(id, entry));
      }
    }
    return lookup;
  }, [problemTopicCatalog, level]);

  const resolveQuestionTopic = useCallback(
    (q: Question): QuestionTopicMeta => {
      for (const id of allQuestionIds(q)) {
        const found = questionTopicLookup.get(id);
        if (found) return found;
      }
      return { slug: topic || "health-safety", title: topicTitlePlain(topic) };
    },
    [questionTopicLookup, topic]
  );

  const allProblemSections = useMemo(() => {
    const grouped = new Map<string, { topic: QuestionTopicMeta; questions: Question[] }>();
    for (const q of bank) {
      const topicMeta = resolveQuestionTopic(q);
      const existing = grouped.get(topicMeta.slug);
      if (existing) {
        existing.questions.push(q);
        continue;
      }
      grouped.set(topicMeta.slug, { topic: topicMeta, questions: [q] });
    }

    return problemTopicCatalog
      .map((entry) => grouped.get(entry.slug))
      .filter((section): section is { topic: QuestionTopicMeta; questions: Question[] } => Boolean(section))
      .filter((section) => section.questions.length > 0);
  }, [bank, problemTopicCatalog, resolveQuestionTopic]);

  const visibleProblemSections = useMemo(() => {
    if (problemTopicFilter === "all") return allProblemSections;
    return allProblemSections.filter((section) => section.topic.slug === problemTopicFilter);
  }, [allProblemSections, problemTopicFilter]);

  useEffect(() => {
    if (problemTopicFilter === "all") return;
    const exists = allProblemSections.some(
      (section) => section.topic.slug === problemTopicFilter
    );
    if (!exists) setProblemTopicFilter("all");
  }, [allProblemSections, problemTopicFilter]);

  const problemQuizBank = useMemo(() => {
    if (problemTopicFilter === "all") return bank;
    return bank.filter((q) => resolveQuestionTopic(q).slug === problemTopicFilter);
  }, [bank, problemTopicFilter, resolveQuestionTopic]);

  const buildNewQuiz = () => {
    const source = problemsOnly ? problemQuizBank : bank;
    const targetSize =
      quizMode === "flashcards" ? flashcardsCount : quizMode === "weak" ? WEAK_COUNT : quizSize;
    const picked = shuffle(source)
      .slice(0, Math.min(targetSize, source.length))
      .map(shuffleQuestionOptions);

    startedAtMsRef.current = Date.now(); // ✅ reset timer

    setQuestions(picked);
    setCurrentIndex(0);
    setSelected(null);
    setAnswers(Array(picked.length).fill(null));
    setScore(0);
    setFinished(false);
    setHasSaved(false);
    setRevealed(false);
  };

  const restartSameQuiz = () => {
    startedAtMsRef.current = Date.now(); // ✅ reset timer

    setQuestions((prev) => shuffle(prev).map(shuffleQuestionOptions));
    setCurrentIndex(0);
    setSelected(null);
    setAnswers((prev) => Array(prev.length).fill(null));
    setScore(0);
    setFinished(false);
    setHasSaved(false);
    setRevealed(false);
  };

  useEffect(() => {
    if (quizMode !== "flashcards" || !flashcardsNeedsSetup) return;
    const defaultLevel: "2" | "3" = hasValidFlashTopic
      ? flashcardLevel3Keys.has(topic)
        ? "3"
        : "2"
      : "2";
    const defaultTopic =
      hasValidFlashTopic && topic ? topic : defaultLevel === "3" ? "all-level-3" : "all-level-2";
    setSetupSelectedLevel(defaultLevel);
    setSetupSelectedTopicKey(defaultTopic);
    setSetupSelectedCount(flashcardsCountRaw === "10" ? 10 : 5);
  }, [
    quizMode,
    flashcardsNeedsSetup,
    hasValidFlashTopic,
    topic,
    flashcardLevel3Keys,
    flashcardsCountRaw,
  ]);

  useEffect(() => {
    if (flashcardsNeedsSetup) {
      setQuestions([]);
      setCurrentIndex(0);
      setSelected(null);
      setAnswers([]);
      setScore(0);
      setFinished(false);
      setHasSaved(false);
      setRevealed(false);
      return;
    }
    const source = problemsOnly ? problemQuizBank : bank;
    if (source.length === 0) {
      setQuestions([]);
      setCurrentIndex(0);
      setSelected(null);
      setAnswers([]);
      setScore(0);
      setFinished(false);
      setHasSaved(false);
      setRevealed(false);
      return;
    }
    if (!showProblemsList) buildNewQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic, bank.length, problemQuizBank.length, problemsOnly, quizSize, showProblemsList, flashcardsNeedsSetup, flashcardsCount, quizMode]);

  useEffect(() => {
    if (!finished || !topic || questions.length === 0) return;
    const seenKey = seenKeyForTopic(level, topic, currentUserId);
    const seen = loadSeenIds(seenKey);
    questions.forEach((q) => {
      seen.add(q.id);
      q.legacyIds?.forEach((legacyId) => seen.delete(legacyId));
    });
    saveSeenIds(seenKey, seen);
  }, [finished, questions, topic, level, currentUserId]);

  const current = questions[currentIndex] ?? null;

  const onPick = (idx: number) => {
    if (!current || revealed) return;
    setSelected(idx);
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = idx;
      return next;
    });
  };

  const onNext = () => {
    if (quizMode === "flashcards") {
      if (!revealed) return;
      const next = currentIndex + 1;
      if (next >= questions.length) {
        setFinished(true);
        return;
      }
      setCurrentIndex(next);
      setRevealed(false);
      return;
    }

    if (selected === null) return;

    if (!revealed && current) {
      if (typeof window !== "undefined" && topic) {
        const pKey = problemKeyForTopic(level, topic, currentUserId);
        const stats = loadProblemStats(pKey);
        const existing = mergedProblemStat(stats, current);
        const wrong = selected === current.correctIndex ? 0 : 1;
        stats[current.id] = {
          wrong: existing.wrong + wrong,
          total: existing.total + 1,
          lastPickedOptionIndex: wrong > 0 ? selected : existing.lastPickedOptionIndex,
          questionText: current.question,
          selectedOptionId:
            wrong > 0 && selected !== null ? String(selected) : existing.selectedOptionId,
          selectedOptionText:
            wrong > 0 && selected !== null ? current.options[selected] : existing.selectedOptionText,
          correctOptionId: String(current.correctIndex),
          missedCount: existing.wrong + wrong,
        };
        current.legacyIds?.forEach((legacyId) => delete stats[legacyId]);
        saveProblemStats(pKey, stats);
      }
      if (selected === current.correctIndex) setScore((s) => s + 1);
      setRevealed(true);
      return;
    }

    const next = currentIndex + 1;
    if (next >= questions.length) {
      setFinished(true);
      return;
    }

    setCurrentIndex(next);
    setSelected(null);
    setRevealed(false);
  };

  const submitQuestionReport = async () => {
    if (!current) return;
    setReportSubmitting(true);
    setReportError("");
    console.log("[question-report]", {
      questionId: current.id,
      legacyIds: current.legacyIds ?? [],
      trade: "electrical",
      reason: reportReason,
      note: reportNote.trim(),
      topic,
      level,
    });
    try {
      await addDoc(collection(db, "questionReports"), {
        createdAt: serverTimestamp(),
        questionId: current.id,
        legacyIds: current.legacyIds ?? [],
        trade: "electrical",
        topic: topic || null,
        level: level || null,
        quizUrl: typeof window !== "undefined" ? window.location.href : "",
        reason: reportReason,
        note: reportNote.trim(),
        userId: currentUserId ?? null,
      });
      setReportOpen(false);
      setReportReason("Wrong answer");
      setReportNote("");
    } catch (error) {
      setReportError(
        error instanceof Error ? error.message : "Failed to submit report"
      );
    } finally {
      setReportSubmitting(false);
    }
  };

  // ✅ SAVE RESULT WHEN FINISHED (now includes answers + time taken)
  useEffect(() => {
    if (!finished) return;
    if (hasSaved) return;
    if (questions.length === 0) return;

    const percent =
      quizMode === "flashcards" ? 0 : Math.round((score / questions.length) * 100);
    const secondsTaken = Math.max(
      0,
      Math.round((Date.now() - startedAtMsRef.current) / 1000)
    );
    const createdAt = new Date().toISOString();
    const shouldAffectProgress = quizMode === "practice";
    if (shouldAffectProgress) {
      saveQuizResult(storageKey, {
        label: `T${Date.now().toString().slice(-4)}`,
        score: percent,
        type: "practice",
        date: createdAt,
        topic: currentTopicKey,

        // ✅ these make the tooltip show real values
        correct: score,
        total: questions.length,
        secondsTaken,
      });

    }
    if (quizMode === "practice" || quizMode === "weak") {
      const misses: Array<{
        questionId: string;
        lastSelectedOptionId?: string;
        lastSelectedOptionText?: string;
      }> = [];
      for (let idx = 0; idx < questions.length; idx += 1) {
        const q = questions[idx];
        const picked = answers[idx];
        const isCorrect = picked === q.correctIndex;
        if (isCorrect || !q.id) continue;
        const selectedOptionId =
          typeof picked === "number" && picked >= 0 ? String(picked) : undefined;
        const selectedOptionText =
          typeof picked === "number" && picked >= 0 && picked < q.options.length
            ? q.options[picked]
            : undefined;
        misses.push({
          questionId: q.id,
          lastSelectedOptionId: selectedOptionId,
          lastSelectedOptionText: selectedOptionText,
        });
      }
      if (misses.length > 0) {
        recordMissedQuestions({
          trade: "electrical",
          level: normalizedLevel,
          userId: currentUserId,
          misses,
        });
      }
    }

    const attemptsKey = getAttemptsKey("electrical", normalizedLevel, currentUserId);
    const attempts = appendAttempt(attemptsKey, {
      id: createAttemptId(),
      createdAt,
      trade: "electrical",
      level: normalizedLevel,
      mode: quizMode,
      topicKey:
        quizMode === "weak"
          ? `all-level-${normalizedLevel}`
          : currentTopicKey,
      scorePercent: percent,
      totalQuestions: quizMode === "flashcards" ? flashcardsCount : questions.length,
      correctCount: quizMode === "flashcards" ? 0 : score,
      durationSec: secondsTaken,
    });

    if ((quizMode === "practice" || quizMode === "weak") && currentUserId) {
      const streakDays = getStreakDays({
        trade: "electrical",
        level: normalizedLevel,
        userId: currentUserId,
      });
      const basePoints = score * 10 + 25;
      void awardLeaderboardPoints({
        uid: currentUserId,
        basePoints,
        streakDays,
      }).catch((error) => {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[leaderboard] failed to award quiz points", {
            error,
            uid: currentUserId,
            basePoints,
            streakDays,
          });
        }
      });
    }

    if (process.env.NODE_ENV !== "production") {
      console.debug("[attempts] saved", {
        key: attemptsKey,
        count: attempts.length,
      });
    }

    setHasSaved(true);
  }, [finished, hasSaved, questions.length, score, topic, currentTopicKey, storageKey, level, currentUserId, quizMode, flashcardsCount, normalizedLevel, questions, answers]);

  const resultTopicKey = useMemo(
    () =>
      (quizMode === "weak"
        ? `all-level-${level === "3" ? "3" : "2"}`
        : currentTopicKey
      ).toLowerCase(),
    [quizMode, level, currentTopicKey]
  );
  const topicAttemptHistory = useMemo(() => {
    if (!finished || quizMode === "flashcards") return [];
    const attemptsKey = getAttemptsKey("electrical", normalizedLevel, currentUserId);
    const all = loadAttempts(attemptsKey);
    return all
      .filter(
        (attempt) =>
          attempt.trade === "electrical" &&
          attempt.level === normalizedLevel &&
          attempt.topicKey.toLowerCase() === resultTopicKey &&
          attempt.mode !== "flashcards"
      )
      .sort((a, b) => {
        const ta = new Date(a.createdAt || "").getTime();
        const tb = new Date(b.createdAt || "").getTime();
        return ta - tb;
      });
  }, [finished, quizMode, normalizedLevel, currentUserId, resultTopicKey, hasSaved]);
  const topicTestAverage = useMemo(() => {
    if (topicAttemptHistory.length === 0) return null;
    const sum = topicAttemptHistory.reduce(
      (acc, item) => acc + (Number(item.scorePercent) || 0),
      0
    );
    return Math.round(sum / topicAttemptHistory.length);
  }, [topicAttemptHistory]);
  const sinceLastTestDelta = useMemo(() => {
    if (quizMode === "flashcards") return null;
    if (topicAttemptHistory.length < 2) return null;
    const previous = Number(topicAttemptHistory[topicAttemptHistory.length - 2]?.scorePercent);
    const latest = Number(topicAttemptHistory[topicAttemptHistory.length - 1]?.scorePercent);
    if (!Number.isFinite(previous) || !Number.isFinite(latest)) return null;
    return Math.round((latest - previous) * 10) / 10;
  }, [quizMode, topicAttemptHistory]);

  const optionClass = (idx: number) => {
    const base =
      "w-full rounded-xl px-4 py-3 text-left transition-all duration-200 " +
      "bg-white/5 border border-white/10";

    if (!revealed) {
      if (selected === idx) {
        return `${base} !bg-amber-500/25 !border-amber-400 !text-amber-50`;
      }
      return `${base} hover:bg-white/10`;
    }

    const isCorrect = current && idx === current.correctIndex;
    const isPicked = idx === selected;
    const pickedWrong = isPicked && idx !== current?.correctIndex;

    if (isCorrect) return `${base} !bg-emerald-600 !border-emerald-500 !text-white`;
    if (pickedWrong) return `${base} !bg-rose-600 !border-rose-500 !text-white`;

    return `${base} opacity-50`;
  };

  return (
    <main className="min-h-screen bg-[#1F1F1F] text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#FFC400]/25 via-[#FF9100]/20 to-[#FFC400]/20 blur-3xl" />
        <div className="absolute bottom-[-220px] right-[-200px] h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-[#FFC400]/18 to-[#FF9100]/12 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_30%_20%,rgba(255,196,0,0.14),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(700px_420px_at_70%_80%,rgba(255,145,0,0.12),transparent_60%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-3xl px-6 py-10">
        <header className="flex items-center justify-between mb-8">
          <div>
            {quizMode === "flashcards" ? (
              <Link
                href="/trade/electrical"
                className="inline-flex rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/10"
              >
                Back
              </Link>
            ) : null}
            <p className="text-xs text-white/60">Spark Theory</p>
            <h1 className="text-xl font-bold">{quizTitle}</h1>
            <p className="text-xs text-white/40">topic: {topic || "(none)"}</p>
          </div>

          {quizMode !== "flashcards" ? (
            <div className="flex gap-2">
              <Link href={topicsHref} className="bg-white/10 px-3 py-2 rounded-lg">
                Topics
              </Link>
            </div>
          ) : null}
        </header>

        {bank.length === 0 && !flashcardsNeedsSetup && (
          <div className="bg-white/5 p-6 rounded-xl ring-1 ring-white/10">
            <p className="text-sm text-white/70">
              {problemsOnly
                ? "No problem questions found yet."
                : topic === "all-level-2" || topic === "all-level-3"
                ? "Mixed quiz bank is empty — check topic mapping / imports."
                : "No questions loaded for this topic."}
            </p>
            <p className="mt-2 text-xs text-white/50">
              Topic in URL: <b>{topic || "(none)"}</b>
            </p>
          </div>
        )}

        {quizMode === "flashcards" && flashcardsNeedsSetup && (
          <div className="bg-white/5 p-6 rounded-xl ring-1 ring-white/10">
            <h2 className="text-xl font-bold">Flashcards setup</h2>
            <p className="mt-2 text-sm text-white/60">
              Choose a topic and card count to start your flashcards session.
            </p>

            <div className="mt-5">
              <p className="text-xs font-semibold text-white/70">Topic</p>
              <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-white/75">Level 2</div>
                  {flashcardLevel2Options.map((option) => {
                    const isSelected =
                      setupSelectedLevel === "2" && setupSelectedTopicKey === option.key;
                    return (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => {
                          setSetupSelectedLevel("2");
                          setSetupSelectedTopicKey(option.key);
                        }}
                        className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold ring-1 transition ${
                          isSelected
                            ? "bg-[#FFC400]/15 text-[#FFC400] ring-[#FFC400]/70"
                            : "bg-white/10 text-white ring-white/15 hover:bg-white/15"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-white/75">Level 3</div>
                  {flashcardLevel3Options.map((option) => {
                    const isSelected =
                      setupSelectedLevel === "3" && setupSelectedTopicKey === option.key;
                    return (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => {
                          setSetupSelectedLevel("3");
                          setSetupSelectedTopicKey(option.key);
                        }}
                        className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold ring-1 transition ${
                          isSelected
                            ? "bg-[#FFC400]/15 text-[#FFC400] ring-[#FFC400]/70"
                            : "bg-white/10 text-white ring-white/15 hover:bg-white/15"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold text-white/70">Card count</p>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {[5, 10].map((count) => {
                  const isSelected = setupSelectedCount === count;
                  return (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setSetupSelectedCount(count as 5 | 10)}
                      className={`rounded-xl px-4 py-3 text-center text-sm font-semibold ring-1 transition ${
                        isSelected
                          ? "bg-[#FFC400]/15 text-[#FFC400] ring-[#FFC400]/70"
                          : "bg-white/10 text-white ring-white/15 hover:bg-white/15"
                      }`}
                    >
                      {count} cards
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("mode", "flashcards");
                  params.set("trade", "electrical");
                  params.set("level", setupSelectedLevel);
                  params.set("topic", setupSelectedTopicKey);
                  params.set("count", String(setupSelectedCount));
                  params.delete("n");
                  params.delete("problems");
                  params.delete("unseen");
                  router.replace(`/quiz?${params.toString()}`, { scroll: false });
                }}
                className="rounded-xl bg-[#FFC400] px-4 py-3 text-sm font-semibold text-black ring-1 ring-[#FF9100]/40 hover:bg-[#FF9100]"
              >
                Start flashcards
              </button>
            </div>
          </div>
        )}

        {accessLoading && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs text-white/70 ring-1 ring-white/10">
            <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white/25 border-t-white/80" />
            Checking your subscription access...
          </div>
        )}

        {problemsOnly && showProblemsList && bank.length > 0 && (
          <div className="bg-white/5 p-6 rounded-xl ring-1 ring-white/10">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">My problem questions</h2>
              <button
                type="button"
                onClick={() => setShowProblemsList(false)}
                className="rounded-lg bg-[#FFC400] px-4 py-2 text-sm font-semibold text-black hover:bg-[#FF9100]"
              >
                Start Problem Quiz
              </button>
            </div>
            <p className="mt-2 text-sm text-white/60">
              These are questions you’ve missed before.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setProblemTopicFilter("all")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ring-1 transition ${
                  problemTopicFilter === "all"
                    ? "bg-[#FFC400]/15 text-[#FFC400] ring-[#FFC400]/60"
                    : "bg-white/5 text-white/75 ring-white/15 hover:bg-white/10"
                }`}
              >
                All topics ({bank.length})
              </button>
              {allProblemSections.map((section) => (
                <button
                  key={section.topic.slug}
                  type="button"
                  onClick={() => setProblemTopicFilter(section.topic.slug)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold ring-1 transition ${
                    problemTopicFilter === section.topic.slug
                      ? "bg-[#FFC400]/15 text-[#FFC400] ring-[#FFC400]/60"
                      : "bg-white/5 text-white/75 ring-white/15 hover:bg-white/10"
                  }`}
                >
                  {section.topic.title} ({section.questions.length})
                </button>
              ))}
            </div>
            <div className="mt-4 space-y-3">
              {visibleProblemSections.map((section) => (
                <div key={section.topic.slug} className="space-y-2">
                  <h3 className="text-sm font-semibold text-white/85">
                    {section.topic.title} ({section.questions.length})
                  </h3>
                  {section.questions.map((q) => (
                    <div
                      key={q.id}
                      className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white/80"
                    >
                      {q.question}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {!finished && current && !showProblemsList && !flashcardsNeedsSetup && (
          <div className="bg-white/5 p-6 rounded-xl ring-1 ring-white/10">
            {quizMode === "flashcards" ? (
              <>
                <p className="mb-3 text-sm text-white/70">
                  Card {currentIndex + 1} of {questions.length}
                </p>
                <div className="flashcard-scene">
                  <button
                    type="button"
                    aria-label={revealed ? "Flashcard back side" : "Flashcard front side"}
                    aria-pressed={revealed}
                    onClick={() => setRevealed((prev) => !prev)}
                    className={`flashcard-card ${revealed ? "is-flipped" : ""}`}
                  >
                    <span className="flashcard-face flashcard-front rounded-xl border border-white/10 bg-white/[0.04] px-4 py-6 text-left">
                      <h2 className="text-lg font-semibold">{current.question}</h2>
                      <div className="mt-4 text-sm text-white/60">Tap to flip</div>
                    </span>
                    <span className="flashcard-face flashcard-back rounded-xl border border-emerald-300/50 bg-emerald-300/10 px-4 py-6 text-left">
                      <div className="text-xs font-semibold uppercase tracking-wide text-emerald-200/80">
                        Answer
                      </div>
                      <div className="mt-1 text-base font-semibold text-emerald-50">
                        {current.options[current.correctIndex]}
                      </div>
                      <div className="mt-4 text-xs text-emerald-100/70">Tap to flip back</div>
                      <div className="mt-3 rounded-lg bg-black/15 px-3 py-2 text-xs text-emerald-50/85 ring-1 ring-emerald-200/20">
                        {current.explanation}
                      </div>
                    </span>
                  </button>
                </div>

                {revealed && (
                  <div className="mt-6 text-right">
                    <button
                      type="button"
                      onClick={onNext}
                      className="bg-white/10 px-4 py-2 rounded-lg"
                    >
                      {currentIndex + 1 === questions.length ? "Finish" : "Next"}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <p className="mb-3 text-sm text-white/70">
                  Question {currentIndex + 1} of {questions.length} — Score: {score}
                </p>

                <h2 className="text-lg font-semibold mb-4">{current.question}</h2>

                <div className="grid gap-3">
                  {current.options.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onPick(idx)}
                      className={optionClass(idx)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => setReportOpen(true)}
                    className="rounded-lg border border-rose-400/50 px-3 py-2 text-sm font-semibold text-rose-200 hover:bg-rose-500/10"
                  >
                    Report Question
                  </button>
                </div>

                {selected !== null && revealed && (
                  <div className="mt-4 rounded-xl border border-amber-300/50 bg-amber-300/15 px-4 py-3 text-sm text-amber-100 ">
                    <div className="text-xs font-semibold uppercase tracking-wide text-amber-200/80">Explanation</div>
                    <div className="mt-1 text-amber-50">{current.explanation}</div>
                  </div>
                )}

                <div className="mt-6 text-right">
                  <button
                    type="button"
                    onClick={onNext}
                    disabled={selected === null}
                    className="bg-white/10 px-4 py-2 rounded-lg disabled:opacity-50"
                  >
                    {!revealed
                      ? "Check answer"
                      : currentIndex + 1 === questions.length
                      ? "Finish"
                      : "Next"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {finished && (
          <>
            <div className="bg-white/5 p-6 rounded-xl ring-1 ring-white/10">
              <h2 className="text-xl font-bold">Finished</h2>
              {quizMode === "flashcards" ? (
                <p className="mt-2 text-white/80">
                  Cards reviewed: {questions.length}
                </p>
              ) : (
                <>
                  <p className="mt-2 text-white/80">
                    Score: {score} / {questions.length}
                  </p>
                  {quizMode === "practice" ? (
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                      <span className="text-white/70">
                        Test average{" "}
                        <span className="font-semibold text-white">
                          {topicTestAverage !== null ? `${topicTestAverage}%` : "—"}
                        </span>
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] ring-1 ${
                          sinceLastTestDelta === null
                            ? "bg-white/10 text-white/70 ring-white/15"
                            : sinceLastTestDelta > 0
                            ? "bg-emerald-500/15 text-emerald-200 ring-emerald-400/30"
                            : sinceLastTestDelta < 0
                            ? "bg-rose-500/15 text-rose-200 ring-rose-400/30"
                            : "bg-white/10 text-white/70 ring-white/15"
                        }`}
                      >
                        {sinceLastTestDelta === null
                          ? "— since last test"
                          : sinceLastTestDelta > 0
                          ? `↑ ${Math.abs(Math.round(sinceLastTestDelta))}% since last test`
                          : sinceLastTestDelta < 0
                          ? `↓ ${Math.abs(Math.round(sinceLastTestDelta))}% since last test`
                          : "→ 0% since last test"}
                      </span>
                    </div>
                  ) : null}
                </>
              )}

              <p className="mt-2 text-xs text-white/60">
                Saved to progress: {hasSaved ? "Yes" : "Saving..."}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={restartSameQuiz}
                  className="rounded-lg bg-white/10 px-4 py-2 ring-1 ring-white/15 hover:bg-white/15"
                >
                  {quizMode === "flashcards"
                    ? `Restart (same ${flashcardsCount} Flashcards)`
                    : quizMode === "weak"
                    ? `Restart (same ${WEAK_COUNT})`
                    : `Restart (same ${questions.length})`}
                </button>

                <button
                  type="button"
                  onClick={buildNewQuiz}
                  className="rounded-lg bg-white/10 px-4 py-2 ring-1 ring-white/15 hover:bg-white/15"
                >
                  {quizMode === "flashcards"
                    ? `New ${flashcardsCount} Flashcards`
                    : quizMode === "weak"
                    ? `New ${WEAK_COUNT} Questions`
                    : `New ${quizSize} Questions`}
                </button>

                {quizMode === "flashcards" ? (
                  <button
                    type="button"
                    onClick={() => {
                      router.replace(backToFlashcardsHref, { scroll: false });
                      restartSameQuiz();
                    }}
                    className="rounded-lg bg-white/10 px-4 py-2 ring-1 ring-white/15 hover:bg-white/15"
                  >
                    Back to Flashcards
                  </button>
                ) : null}
                <Link
                  href={topicsHref}
                  className="rounded-lg bg-white/10 px-4 py-2 ring-1 ring-white/15 hover:bg-white/15"
                >
                  Back to Topics
                </Link>
              </div>
            </div>

            {/* Results breakdown */}
            {quizMode !== "flashcards" && (
            <div className="mt-6">
              <h3 className="mb-3 text-lg font-semibold">Results Breakdown</h3>
              <div className="grid gap-4">
                {questions.map((q, idx) => {
                  const picked = answers[idx];
                  const isCorrect = picked === q.correctIndex;
                  const pickedText =
                    picked === null ? "No answer" : q.options[picked];
                  const correctText = q.options[q.correctIndex];

                  return (
                    <div
                      key={q.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.06] p-5"
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
                            isCorrect
                              ? "bg-emerald-500/20 text-emerald-200"
                              : "bg-rose-500/20 text-rose-200"
                          }`}
                        >
                          {isCorrect ? "✓" : "✕"}
                        </span>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold">{q.question}</div>

                          <div className="mt-2 text-sm text-white/70">
                            <span className="text-white/60">Your answer: </span>
                            <span
                              className={isCorrect ? "text-emerald-200" : "text-rose-200"}
                            >
                              {pickedText}
                            </span>
                          </div>

                          {!isCorrect ? (
                            <div className="mt-1 text-sm text-white/70">
                              <span className="text-white/60">Correct answer: </span>
                              <span className="text-emerald-200">{correctText}</span>
                            </div>
                          ) : null}

                          <div className="mt-3 rounded-xl border border-[#FFC400]/40 bg-[#FFC400]/10 px-4 py-3 text-sm text-[#FFF3C4]">
                            <div className="text-xs font-semibold uppercase tracking-wide text-[#FFC400]/90">
                              Explanation
                            </div>
                            <div className="mt-1 text-[#FFF3C4]">
                              {q.explanation}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            )}

          </>
        )}
      </div>

      {reportOpen && current && !showProblemsList && !finished && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-6"
          onClick={() => setReportOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-[#1F1F1F] p-6 ring-1 ring-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold">Report Question</h3>
            <p className="mt-1 text-xs text-white/50">Question ID: {current.id}</p>

            <div className="mt-4">
              <label className="mb-1 block text-xs font-semibold text-white/70">
                Reason
              </label>
              <select
                value={reportReason}
                onChange={(e) =>
                  setReportReason(
                    e.target.value as "Wrong category" | "Wrong answer" | "Typo" | "Other"
                  )
                }
                className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none"
              >
                <option value="Wrong category">Wrong category</option>
                <option value="Wrong answer">Wrong answer</option>
                <option value="Typo">Typo</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="mt-4">
              <label className="mb-1 block text-xs font-semibold text-white/70">
                Notes (optional)
              </label>
              <input
                type="text"
                value={reportNote}
                onChange={(e) => setReportNote(e.target.value)}
                placeholder="Add a short note"
                className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 outline-none"
              />
            </div>
            {reportError && (
              <p className="mt-3 text-xs text-rose-200">{reportError}</p>
            )}

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setReportOpen(false)}
                className="flex-1 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/15 hover:bg-white/15"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitQuestionReport}
                disabled={reportSubmitting}
                className="flex-1 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/15 hover:bg-white/15"
              >
                {reportSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
