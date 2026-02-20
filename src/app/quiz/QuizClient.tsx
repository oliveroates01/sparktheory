"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth } from "@/lib/firebase";
import { db } from "@/lib/firebase";

import ProgressReport, { type StoredResult } from "@/components/ProgressReport";

import { healthSafetyQuestions } from "@/data/healthSafety";
import { principlesElectricalScienceQuestions } from "@/data/principlesElectricalScience";
import { principlesElectricalScienceLevel3Questions } from "@/data/principlesElectricalScienceLevel3";
import { electricalInstallationTechnologyQuestions } from "@/data/ElectricalInstallationTechnology";
import { installationWiringQuestions } from "@/data/installationWiring";
import { communicationWithinBSEQuestions } from "@/data/communicationWithinBSE";
import { electricalTechnologyLevel3Questions } from "@/data/electricalTechnologyLevel3";
import { inspectionTestingCommissioningLevel3Questions } from "@/data/inspectionTestingCommissioningLevel3";

type Question = {
  id: string;
  legacyIds?: string[];
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
};

type ProblemStat = {
  wrong: number;
  total: number;
};

type ProblemStats = Record<string, ProblemStat>;
type QuestionTopicMeta = {
  slug: string;
  title: string;
};

const STORAGE_KEY_LEVEL2 = "qm_results_v1";
const STORAGE_KEY_LEVEL3 = "qm_results_v1_level3";
const DEFAULT_QUIZ_SIZE = 4;
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

function storageKeyForLevel(level: string) {
  return level === "3" ? STORAGE_KEY_LEVEL3 : STORAGE_KEY_LEVEL2;
}

function seenKeyForTopic(level: string, topic: string) {
  const safeTopic = topic || "unknown";
  return `qm_seen_${level === "3" ? "3" : "2"}_${safeTopic}`;
}

function problemKeyForTopic(level: string, topic: string) {
  const safeTopic = topic || "unknown";
  return `qm_problem_${level === "3" ? "3" : "2"}_${safeTopic}`;
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
    question,
    options,
    correctIndex,
    explanation,
  };
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
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [hasPlusAccess, setHasPlusAccess] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [subscriptionReady, setSubscriptionReady] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [entitlementsLoading, setEntitlementsLoading] = useState(true);

  const topic = (searchParams.get("topic") ?? "").trim().toLowerCase();

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
        const response = await fetch("/api/stripe/subscription-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email, uid: user.uid }),
        });
        const result = (await response.json().catch(() => ({}))) as {
          hasPlusAccess?: boolean;
          hasSubscription?: boolean;
        };
        plusFromStripe = Boolean(result.hasPlusAccess ?? result.hasSubscription);
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
            }
          | undefined;
        const plan = (profile?.plan || "").toUpperCase();
        const status = (profile?.subscriptionStatus || "").toLowerCase();
        plusFromProfile =
          Boolean(profile?.hasPlusAccess) || (plan === "PLUS" && status === "active");
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
  const problemsOnly = (searchParams.get("problems") ?? "").trim() === "1";
  const storageKey = storageKeyForLevel(level);
  const nRaw = (searchParams.get("n") ?? "").trim();
  const quizSize =
    Number.isFinite(Number(nRaw)) && Number(nRaw) > 0
      ? Number(nRaw)
      : DEFAULT_QUIZ_SIZE;

  const quizTitle = topicTitle(topic);
  const topicsHref =
    level === "3" ? "/trade/electrical?level=3" : "/trade/electrical";
  const unseenOnly = (searchParams.get("unseen") ?? "").trim() === "1";
  const requiresPlusTopic =
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
      rawBankForTopic(topicSlug, level)
        .map((q, i) => normalizeQuestion(q, i))
        .filter((q): q is Question => Boolean(q));

    const normalized = normalizedByTopic(topic);

    if (typeof window === "undefined") return normalized;

    if (problemsOnly && topic) {
      const catalog = topicCatalogForLevel(level);
      const isAllTopics = topic === "all-level-2" || topic === "all-level-3";
      const scopedTopics = isAllTopics
        ? catalog
        : catalog.filter((entry) => entry.slug === topic);
      const mixedKey = isAllTopics ? problemKeyForTopic(level, topic) : null;
      const seenQuestionIds = new Set<string>();
      const collected: Array<{ question: Question; wrong: number }> = [];

      for (const entry of scopedTopics) {
        const questionsForTopic = normalizedByTopic(entry.slug);
        const statsByTopic = loadProblemStats(problemKeyForTopic(level, entry.slug));
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

    const seenKey = seenKeyForTopic(level, topic);
    const seen = loadSeenIds(seenKey);
    if (seen.size === 0) return normalized;

    const unseen = normalized.filter((q) => !hasSeenQuestion(seen, q));
    return unseen.length > 0 ? unseen : normalized;
  }, [topic, level, unseenOnly, problemsOnly]);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Array<number | null>>([]);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showProblemsList, setShowProblemsList] = useState(problemsOnly);
  const [problemTopicFilter, setProblemTopicFilter] = useState<string>("all");
  const [revealed, setRevealed] = useState(false);

  // prevent saving twice
  const [hasSaved, setHasSaved] = useState(false);

  // end-of-exam chart: only this topic results
  const [topicResults, setTopicResults] = useState<StoredResult[]>([]);

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
    const picked = shuffle(source)
      .slice(0, Math.min(quizSize, source.length))
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
    const source = problemsOnly ? problemQuizBank : bank;
    if (source.length === 0) {
      setQuestions([]);
      setCurrentIndex(0);
      setSelected(null);
      setAnswers([]);
      setScore(0);
      setFinished(false);
      setHasSaved(false);
      setTopicResults([]);
      setRevealed(false);
      return;
    }
    if (!showProblemsList) buildNewQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic, bank.length, problemQuizBank.length, problemsOnly, quizSize, showProblemsList]);

  useEffect(() => {
    if (!finished || !topic || questions.length === 0) return;
    const seenKey = seenKeyForTopic(level, topic);
    const seen = loadSeenIds(seenKey);
    questions.forEach((q) => {
      seen.add(q.id);
      q.legacyIds?.forEach((legacyId) => seen.delete(legacyId));
    });
    saveSeenIds(seenKey, seen);
  }, [finished, questions, topic, level]);

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
    if (selected === null) return;

    if (!revealed && current) {
      if (typeof window !== "undefined" && topic) {
        const pKey = problemKeyForTopic(level, topic);
        const stats = loadProblemStats(pKey);
        const existing = mergedProblemStat(stats, current);
        const wrong = selected === current.correctIndex ? 0 : 1;
        stats[current.id] = {
          wrong: existing.wrong + wrong,
          total: existing.total + 1,
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

  // ✅ SAVE RESULT WHEN FINISHED (now includes answers + time taken)
  useEffect(() => {
    if (!finished) return;
    if (hasSaved) return;
    if (questions.length === 0) return;

    const percent = Math.round((score / questions.length) * 100);
    const secondsTaken = Math.max(
      0,
      Math.round((Date.now() - startedAtMsRef.current) / 1000)
    );

    saveQuizResult(storageKey, {
      label: `T${Date.now().toString().slice(-4)}`,
      score: percent,
      type: "practice",
      date: new Date().toISOString(),
      topic,

      // ✅ these make the tooltip show real values
      correct: score,
      total: questions.length,
      secondsTaken,
    });

    setHasSaved(true);
  }, [finished, hasSaved, questions.length, score, topic]);

  // Load topic-only results for end-of-exam chart
  useEffect(() => {
    if (!finished) return;

    const all = loadAllResults(storageKey);
    const onlyThisTopic = all.filter(
      (r) => (r.topic || "").toLowerCase() === topic.toLowerCase()
    );

    const sorted = [...onlyThisTopic].sort((a, b) => {
      const ta = new Date(a.date || "").getTime();
      const tb = new Date(b.date || "").getTime();
      return ta - tb;
    });

    setTopicResults(sorted);
  }, [finished, topic, hasSaved, storageKey]);

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
            <p className="text-xs text-white/60">Spark Theory</p>
            <h1 className="text-xl font-bold">{quizTitle}</h1>
            <p className="text-xs text-white/40">topic: {topic || "(none)"}</p>
          </div>

          <div className="flex gap-2">
            <Link href={topicsHref} className="bg-white/10 px-3 py-2 rounded-lg">
              Topics
            </Link>
          </div>
        </header>

        {bank.length === 0 && (
          <div className="bg-white/5 p-6 rounded-xl ring-1 ring-white/10">
            <p className="text-sm text-white/70">
              {problemsOnly
                ? "No problem questions found yet."
                : "No questions loaded for this topic."}
            </p>
            <p className="mt-2 text-xs text-white/50">
              Topic in URL: <b>{topic || "(none)"}</b>
            </p>
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

        {!finished && current && !showProblemsList && (
          <div className="bg-white/5 p-6 rounded-xl ring-1 ring-white/10">
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
          </div>
        )}

        {finished && (
          <>
            <div className="bg-white/5 p-6 rounded-xl ring-1 ring-white/10">
              <h2 className="text-xl font-bold">Finished</h2>
              <p className="mt-2 text-white/80">
                Score: {score} / {questions.length}
              </p>

              <p className="mt-2 text-xs text-white/60">
                Saved to progress: {hasSaved ? "Yes" : "Saving..."}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={restartSameQuiz}
                  className="rounded-lg bg-white/10 px-4 py-2 ring-1 ring-white/15 hover:bg-white/15"
                >
                  Restart (same {questions.length})
                </button>

                <button
                  type="button"
                  onClick={buildNewQuiz}
                  className="rounded-lg bg-white/10 px-4 py-2 ring-1 ring-white/15 hover:bg-white/15"
                >
                  New {quizSize} Questions
                </button>

                <Link
                  href={topicsHref}
                  className="rounded-lg bg-white/10 px-4 py-2 ring-1 ring-white/15 hover:bg-white/15"
                >
                  Back to Topics
                </Link>
              </div>
            </div>

            {/* Results breakdown */}
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

                          <div className="mt-1 text-sm text-white/70">
                            <span className="text-white/60">Correct answer: </span>
                            <span className="text-emerald-200">{correctText}</span>
                          </div>

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

            {/* ✅ Topic-only chart at end of THIS exam */}
            <div className="mt-6">
              <ProgressReport
                results={topicResults}
                topics={[topic]}
                lockedTopic={topic}
              />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
