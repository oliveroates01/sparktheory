"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth } from "@/lib/firebase";
import { db } from "@/lib/firebase";
import { normalizeManualOverride, resolvePlusAccess } from "@/lib/entitlements";
import {
  appendAttempt,
  createAttemptId,
  getAttemptsKey,
  getStreakDays,
} from "@/lib/progress/attempts";
import { awardLeaderboardPoints } from "@/lib/leaderboard/points";
import { healthSafetyQuestions } from "@/data/healthSafety";
import { principlesElectricalScienceQuestions } from "@/data/principlesElectricalScience";
import { electricalInstallationTechnologyQuestions } from "@/data/ElectricalInstallationTechnology";
import { installationWiringQuestions } from "@/data/installationWiring";
import { communicationWithinBSEQuestions } from "@/data/communicationWithinBSE";
import { principlesElectricalScienceLevel3Questions } from "@/data/principlesElectricalScienceLevel3";
import { electricalTechnologyLevel3Questions } from "@/data/electricalTechnologyLevel3";
import { inspectionTestingCommissioningLevel3Questions } from "@/data/inspectionTestingCommissioningLevel3";
import {
  ELECTRICAL_LEVEL2_CATEGORIES,
  ELECTRICAL_LEVEL3_CATEGORIES,
} from "@/data/electricalTopicCategories";

type Question = {
  id: string;
  topic: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
};

type ExamConfig = { minutes: number; questions: number };

const EXAM_CONFIG_BY_LEVEL: Record<"2" | "3", Record<string, ExamConfig>> = {
  "2": {
    "all-level-2": { minutes: 120, questions: 50 },
    "health-safety": { minutes: 120, questions: 50 },
    "principles-electrical-science": { minutes: 120, questions: 50 },
    "electrical-installation-technology": { minutes: 120, questions: 50 },
    "installation-wiring-systems-enclosures": { minutes: 120, questions: 50 },
    "communication-within-building-services-engineering": { minutes: 120, questions: 50 },
  },
  "3": {
    "all-level-3": { minutes: 150, questions: 50 },
    "principles-electrical-science": { minutes: 150, questions: 50 },
    "electrical-technology": { minutes: 150, questions: 50 },
    "inspection-testing-commissioning": { minutes: 150, questions: 50 },
  },
};
const EXAM_COUNT_OPTIONS = [20, 40, 50] as const;
const PASS_PERCENT = 70;
const PLUS_ACCESS_CACHE_PREFIX = "qm_plus_access_";

function toNumber(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function toStringArray4(v: unknown): [string, string, string, string] | null {
  if (!Array.isArray(v) || v.length !== 4) return null;
  const out = v.map((x) => (typeof x === "string" ? x.trim() : ""));
  if (out.some((s) => !s)) return null;
  return out as [string, string, string, string];
}

function inferTopicSlugFromQuestionId(id: string): string {
  if (id.startsWith("hs-")) return "health-safety";
  if (id.startsWith("pes-") || id.startsWith("pes3-")) return "principles-electrical-science";
  if (id.startsWith("eit-")) return "electrical-installation-technology";
  if (id.startsWith("iwse-")) return "installation-wiring-systems-enclosures";
  if (id.startsWith("comm-")) return "communication-within-building-services-engineering";
  if (id.startsWith("et3-")) return "electrical-technology";
  if (id.startsWith("itc3-")) return "inspection-testing-commissioning";
  return "health-safety";
}

function normalizeQuestions(raw: unknown[]): Question[] {
  const out: Question[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < raw.length; i += 1) {
    const rec = raw[i] as Record<string, unknown>;
    if (!rec || typeof rec !== "object") continue;
    const id = typeof rec.id === "string" ? rec.id : `q-${i + 1}`;
    if (seen.has(id)) continue;
    const question = typeof rec.question === "string" ? rec.question : "";
    const options = toStringArray4(rec.options);
    const correctIndex = toNumber(rec.correctIndex);
    if (!question || !options || correctIndex === null || correctIndex < 0 || correctIndex > 3) {
      continue;
    }
    seen.add(id);
    out.push({
      id,
      topic:
        typeof rec.topic === "string" && rec.topic.trim()
          ? rec.topic.trim().toLowerCase()
          : inferTopicSlugFromQuestionId(id),
      question,
      options,
      correctIndex,
    });
  }
  return out;
}

function shuffle<T>(arr: T[]) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function formatTime(totalSec: number) {
  const s = Math.max(0, totalSec);
  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

function topicLabel(topic: string) {
  if (topic === "all-level-2") return "Level 2 Mixed";
  if (topic === "all-level-3") return "Level 3 Mixed";
  if (topic === "health-safety") return "Health & Safety";
  if (topic === "principles-electrical-science") return "Principles of Electrical Science";
  if (topic === "electrical-installation-technology") return "Electrical Installation Technology";
  if (topic === "installation-wiring-systems-enclosures") return "Installation Wiring Systems & Enclosures";
  if (topic === "communication-within-building-services-engineering") return "Communication within BSE";
  if (topic === "electrical-technology") return "Electrical Technology";
  if (topic === "inspection-testing-commissioning") return "Inspection, Testing & Commissioning";
  return topic;
}

function topicFromHref(href?: string) {
  if (!href) return "";
  const query = href.split("?")[1] || "";
  const sp = new URLSearchParams(query);
  return (sp.get("topic") || "").trim().toLowerCase();
}

function examTopicOptions(level: "2" | "3") {
  const categories = level === "3" ? ELECTRICAL_LEVEL3_CATEGORIES : ELECTRICAL_LEVEL2_CATEGORIES;
  return categories
    .map((category) => {
      const key = topicFromHref(category.href);
      const isMixed = key === "all-level-2" || key === "all-level-3";
      return {
        key,
        label: isMixed ? (level === "3" ? "Level 3 Mixed" : "Level 2 Mixed") : category.title,
        isMixed,
      };
    })
    .filter((option) => Boolean(option.key));
}

function defaultRealTopic(level: "2" | "3") {
  const options = examTopicOptions(level);
  return options.find((option) => !option.isMixed)?.key || (level === "3" ? "all-level-3" : "all-level-2");
}

function examConfigFor(level: "2" | "3", topicKey: string): ExamConfig {
  const map = EXAM_CONFIG_BY_LEVEL[level];
  const mixedKey = level === "3" ? "all-level-3" : "all-level-2";
  return map[topicKey] || map[mixedKey];
}

function examBank(level: "2" | "3", topicKey: string) {
  const mixedLevel2 = [
    ...(healthSafetyQuestions as unknown[]),
    ...(principlesElectricalScienceQuestions as unknown[]),
    ...(electricalInstallationTechnologyQuestions as unknown[]),
    ...(installationWiringQuestions as unknown[]),
    ...(communicationWithinBSEQuestions as unknown[]),
  ];
  const mixedLevel3 = [
    ...(principlesElectricalScienceLevel3Questions as unknown[]),
    ...(electricalTechnologyLevel3Questions as unknown[]),
    ...(inspectionTestingCommissioningLevel3Questions as unknown[]),
  ];
  if (topicKey === "all-level-2") return normalizeQuestions(mixedLevel2);
  if (topicKey === "all-level-3") return normalizeQuestions(mixedLevel3);
  if (topicKey === "health-safety") return normalizeQuestions(healthSafetyQuestions as unknown[]);
  if (topicKey === "principles-electrical-science") {
    return normalizeQuestions(
      level === "3"
        ? (principlesElectricalScienceLevel3Questions as unknown[])
        : (principlesElectricalScienceQuestions as unknown[])
    );
  }
  if (topicKey === "electrical-installation-technology") {
    return normalizeQuestions(electricalInstallationTechnologyQuestions as unknown[]);
  }
  if (topicKey === "installation-wiring-systems-enclosures") {
    return normalizeQuestions(installationWiringQuestions as unknown[]);
  }
  if (topicKey === "communication-within-building-services-engineering") {
    return normalizeQuestions(communicationWithinBSEQuestions as unknown[]);
  }
  if (topicKey === "electrical-technology") {
    return normalizeQuestions(electricalTechnologyLevel3Questions as unknown[]);
  }
  if (topicKey === "inspection-testing-commissioning") {
    return normalizeQuestions(inspectionTestingCommissioningLevel3Questions as unknown[]);
  }
  return normalizeQuestions(level === "3" ? mixedLevel3 : mixedLevel2);
}

export default function ElectricalExamClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [hasPlusAccess, setHasPlusAccess] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [subscriptionReady, setSubscriptionReady] = useState(false);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [savedAttempt, setSavedAttempt] = useState(false);
  const [timeLeftSec, setTimeLeftSec] = useState(
    examConfigFor("2", "all-level-2").minutes * 60
  );
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<number | null>>([]);
  const startedAtRef = useRef<number>(0);

  const queryLevel: "2" | "3" = searchParams.get("level") === "3" ? "3" : "2";
  const queryTopic = (searchParams.get("topic") || "").trim().toLowerCase();
  const fallbackTopic = defaultRealTopic(queryLevel);
  const queryTopicValid = examTopicOptions(queryLevel).some((option) => option.key === queryTopic);
  const initialTopic = queryTopicValid && queryTopic ? queryTopic : fallbackTopic;
  const queryCountRaw = Number(searchParams.get("count") || "");
  const queryDefaultCount = examConfigFor(queryLevel, initialTopic).questions;
  const queryCount = EXAM_COUNT_OPTIONS.includes(queryCountRaw as (typeof EXAM_COUNT_OPTIONS)[number])
    ? (queryCountRaw as (typeof EXAM_COUNT_OPTIONS)[number])
    : (queryDefaultCount as (typeof EXAM_COUNT_OPTIONS)[number]);
  const [setupLevel, setSetupLevel] = useState<"2" | "3">(queryLevel);
  const [setupTopic, setSetupTopic] = useState<string>(initialTopic);
  const [setupCount, setSetupCount] = useState<(typeof EXAM_COUNT_OPTIONS)[number]>(queryCount);
  const [activeLevel, setActiveLevel] = useState<"2" | "3">(queryLevel);
  const [activeTopic, setActiveTopic] = useState<string>(initialTopic);
  const [activeCount, setActiveCount] = useState<number>(queryCount);

  const setupTopicOptions = useMemo(() => examTopicOptions(setupLevel), [setupLevel]);
  const setupExamConfig = useMemo(
    () => examConfigFor(setupLevel, setupTopic),
    [setupLevel, setupTopic]
  );

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
        // ignore transient errors
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
        // ignore profile lookup errors
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
      }
    };

    const unsub = onAuthStateChanged(auth, (user) => {
      setUserLoggedIn(Boolean(user));
      setCurrentUserId(user?.uid ?? null);
      setAuthReady(true);
      if (!user) {
        setHasPlusAccess(false);
        setSubscriptionReady(true);
        return;
      }
      try {
        const cached = localStorage.getItem(`${PLUS_ACCESS_CACHE_PREFIX}${user.uid}`);
        if (cached === "1") setHasPlusAccess(true);
      } catch {
        // ignore cache failures
      }
      setSubscriptionReady(false);
      void loadSubscription(user);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!authReady || !subscriptionReady) return;
    if (hasPlusAccess) return;
    router.replace(userLoggedIn ? "/account" : "/login");
  }, [authReady, subscriptionReady, hasPlusAccess, userLoggedIn, router]);

  useEffect(() => {
    if (started) return;
    const fallbackTopic = defaultRealTopic(queryLevel);
    const queryTopicValid = examTopicOptions(queryLevel).some((option) => option.key === queryTopic);
    const nextTopic = queryTopicValid && queryTopic ? queryTopic : fallbackTopic;
    setSetupLevel(queryLevel);
    setSetupTopic(nextTopic);
    setSetupCount(
      EXAM_COUNT_OPTIONS.includes(queryCountRaw as (typeof EXAM_COUNT_OPTIONS)[number])
        ? (queryCountRaw as (typeof EXAM_COUNT_OPTIONS)[number])
        : (examConfigFor(queryLevel, nextTopic).questions as (typeof EXAM_COUNT_OPTIONS)[number])
    );
  }, [queryLevel, queryTopic, queryCountRaw, started]);

  useEffect(() => {
    if (!started || finished) return;
    const id = window.setInterval(() => {
      setTimeLeftSec((prev) => {
        if (prev <= 1) {
          window.clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [started, finished]);

  useEffect(() => {
    if (!started || finished) return;
    if (timeLeftSec > 0) return;
    setFinished(true);
  }, [timeLeftSec, started, finished]);

  const score = useMemo(() => {
    return questions.reduce((acc, q, idx) => {
      if (answers[idx] === q.correctIndex) return acc + 1;
      return acc;
    }, 0);
  }, [answers, questions]);

  const percent = useMemo(() => {
    if (questions.length === 0) return 0;
    return Math.round((score / questions.length) * 100);
  }, [score, questions.length]);

  const durationSec = useMemo(() => {
    if (!startedAtRef.current) return 0;
    const elapsed = Math.round((Date.now() - startedAtRef.current) / 1000);
    const cap = examConfigFor(activeLevel, activeTopic).minutes * 60;
    return Math.max(0, Math.min(cap, elapsed));
  }, [finished, activeLevel, activeTopic]);

  const breakdown = useMemo(() => {
    const rows: Record<string, { correct: number; total: number }> = {};
    questions.forEach((q, idx) => {
      const key = q.topic || "unknown";
      if (!rows[key]) rows[key] = { correct: 0, total: 0 };
      rows[key].total += 1;
      if (answers[idx] === q.correctIndex) rows[key].correct += 1;
    });
    return Object.entries(rows).map(([topic, row]) => ({
      topic,
      ...row,
      percent: row.total > 0 ? Math.round((row.correct / row.total) * 100) : 0,
    }));
  }, [answers, questions]);

  useEffect(() => {
    if (!finished || savedAttempt || questions.length === 0) return;
    const key = getAttemptsKey("electrical", activeLevel, currentUserId);
    appendAttempt(key, {
      id: createAttemptId(),
      createdAt: new Date().toISOString(),
      trade: "electrical",
      level: activeLevel,
      mode: "exam",
      topicKey: activeTopic,
      scorePercent: percent,
      totalQuestions: questions.length,
      correctCount: score,
      durationSec,
    });

    if (currentUserId) {
      const streakDays = getStreakDays({
        trade: "electrical",
        level: activeLevel,
        userId: currentUserId,
      });
      const basePoints =
        score * 10 + 50 + (percent >= PASS_PERCENT ? 50 : 0);
      void awardLeaderboardPoints({
        uid: currentUserId,
        basePoints,
        streakDays,
      }).catch((error) => {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[leaderboard] failed to award exam points", {
            error,
            uid: currentUserId,
            basePoints,
            streakDays,
          });
        }
      });
    }

    setSavedAttempt(true);
  }, [finished, savedAttempt, questions.length, activeLevel, activeTopic, currentUserId, percent, score, durationSec]);

  const startExam = (nextLevel: "2" | "3", nextTopic: string, nextCount: number) => {
    const bank = examBank(nextLevel, nextTopic);
    const picked = shuffle(bank).slice(0, Math.min(nextCount, bank.length));
    const config = examConfigFor(nextLevel, nextTopic);
    setActiveLevel(nextLevel);
    setActiveTopic(nextTopic);
    setActiveCount(nextCount);
    setQuestions(picked);
    setAnswers(Array(picked.length).fill(null));
    setCurrentIndex(0);
    setTimeLeftSec(config.minutes * 60);
    setFinished(false);
    setSavedAttempt(false);
    setStarted(true);
    startedAtRef.current = Date.now();
  };

  const setLevelParam = (nextLevel: "2" | "3") => {
    if (started && !finished) return;
    setSetupLevel(nextLevel);
    const fallbackTopic = defaultRealTopic(nextLevel);
    setSetupTopic(fallbackTopic);
    setSetupCount(examConfigFor(nextLevel, fallbackTopic).questions as (typeof EXAM_COUNT_OPTIONS)[number]);
  };

  const current = questions[currentIndex] ?? null;
  const answeredCount = answers.filter((a) => a !== null).length;

  return (
    <main className="min-h-screen bg-[#1F1F1F] text-white page-transition">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#FFC400]/25 via-[#FF9100]/20 to-[#FFC400]/20 blur-3xl" />
        <div className="absolute bottom-[-220px] right-[-200px] h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-[#FFC400]/18 to-[#FF9100]/12 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_30%_20%,rgba(255,196,0,0.14),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(700px_420px_at_70%_80%,rgba(255,145,0,0.12),transparent_60%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-6 py-10">
        <section className="mx-auto w-full max-w-4xl">
          <div className="flex items-center justify-between gap-3">
            <Link
              href={activeLevel === "3" ? "/trade/electrical?level=3" : "/trade/electrical?level=2"}
              className="inline-flex rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/10"
            >
              Back
            </Link>
            {started && !finished ? (
              <div className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold ring-1 ring-white/10">
                Time left: {formatTime(timeLeftSec)}
              </div>
            ) : null}
          </div>

          <div className="mt-4 grid w-full max-w-2xl grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setLevelParam("2")}
              className={`rounded-md px-3 py-2 text-left ring-1 transition ${
                setupLevel === "2"
                  ? "bg-white/10 ring-[#FFC400]/50 shadow-[0_0_0_1px_rgba(255,196,0,0.28),0_10px_24px_rgba(255,145,0,0.18)]"
                  : "bg-white/5 ring-white/10 hover:bg-white/10 hover:ring-[#FFC400]/40"
              }`}
            >
              <div className="mt-0.5 text-[13px] font-semibold text-white">Level 2 Electrical</div>
            </button>
            <button
              type="button"
              onClick={() => setLevelParam("3")}
              className={`rounded-md px-3 py-2 text-left ring-1 transition ${
                setupLevel === "3"
                  ? "bg-white/10 ring-[#FFC400]/50 shadow-[0_0_0_1px_rgba(255,196,0,0.28),0_10px_24px_rgba(255,145,0,0.18)]"
                  : "bg-white/5 ring-white/10 hover:bg-white/10 hover:ring-[#FFC400]/40"
              }`}
            >
              <div className="mt-0.5 text-[13px] font-semibold text-white">Level 3 Electrical</div>
            </button>
          </div>

          {!started ? (
            <div className="mt-6 min-h-[560px] sm:min-h-[620px] rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <h1 className="text-2xl font-bold">Exam Mode</h1>
              <p className="mt-2 text-sm text-white/70">
                Timed mock exam ({setupCount} questions, {setupExamConfig.minutes} minutes).
                No answer feedback is shown until submission.
              </p>
              <div className="mt-5">
                <p className="text-xs font-semibold text-white/70">Topic</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {setupTopicOptions.map((option) => {
                    const selected = setupTopic === option.key;
                    return (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => {
                          setSetupTopic(option.key);
                          setSetupCount(
                            examConfigFor(setupLevel, option.key).questions as (typeof EXAM_COUNT_OPTIONS)[number]
                          );
                        }}
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 transition ${
                          selected
                            ? "bg-[#FFC400] text-black ring-[#FF9100]/40"
                            : "bg-white/10 text-white/70 ring-white/10 hover:bg-white/15"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="mt-5">
                <p className="text-xs font-semibold text-white/70">Question count</p>
                <div className="mt-2 grid grid-cols-3 gap-3">
                  {EXAM_COUNT_OPTIONS.map((count) => {
                    const selected = setupCount === count;
                    return (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setSetupCount(count)}
                        className={`rounded-xl px-4 py-3 text-center text-sm font-semibold ring-1 transition ${
                          selected
                            ? "bg-[#FFC400]/15 text-[#FFC400] ring-[#FFC400]/70"
                            : "bg-white/10 text-white ring-white/15 hover:bg-white/15"
                        }`}
                      >
                        {count}
                      </button>
                    );
                  })}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const params = new URLSearchParams({
                    level: setupLevel,
                    topic: setupTopic,
                    count: String(setupCount),
                  });
                  router.replace(`/trade/electrical/exam?${params.toString()}`, { scroll: false });
                  startExam(setupLevel, setupTopic, setupCount);
                }}
                className="mt-5 rounded-xl bg-[#FFC400] px-4 py-3 text-sm font-semibold text-black ring-1 ring-[#FF9100]/40 hover:bg-[#FF9100]"
              >
                Start exam
              </button>
            </div>
          ) : finished ? (
            <div className="mt-6 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <h2 className="text-2xl font-bold">Exam complete</h2>
              <div className="mt-3 text-sm text-white/70">
                <div>
                  Result: <span className={`font-semibold ${percent >= PASS_PERCENT ? "text-emerald-300" : "text-rose-300"}`}>{percent >= PASS_PERCENT ? "Pass" : "Fail"}</span>
                </div>
                <div>Score: <span className="font-semibold text-white">{score}/{questions.length} ({percent}%)</span></div>
                <div>Duration: <span className="font-semibold text-white">{formatTime(durationSec)}</span></div>
              </div>

              <h3 className="mt-5 text-sm font-semibold text-white/80">Score breakdown by topic</h3>
              <div className="mt-2 space-y-2">
                {breakdown.map((row) => (
                  <div key={row.topic} className="rounded-lg bg-black/25 px-3 py-2 text-xs ring-1 ring-white/10">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-white/80">{topicLabel(row.topic)}</span>
                      <span className="font-semibold text-white">{row.correct}/{row.total} ({row.percent}%)</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => startExam(activeLevel, activeTopic, activeCount)}
                  className="rounded-xl bg-[#FFC400] px-4 py-2.5 text-sm font-semibold text-black ring-1 ring-[#FF9100]/40 hover:bg-[#FF9100]"
                >
                  Retake exam
                </button>
                <Link
                  href={activeLevel === "3" ? "/trade/electrical?level=3" : "/trade/electrical?level=2"}
                  className="rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold ring-1 ring-white/15 hover:bg-white/15"
                >
                  Back to topics
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <div className="flex items-center justify-between gap-3 text-xs text-white/70">
                <span>Question {currentIndex + 1} of {questions.length}</span>
                <span>Answered {answeredCount}/{questions.length}</span>
              </div>

              <h2 className="mt-4 text-lg font-semibold leading-snug">{current?.question}</h2>

              <div className="mt-4 space-y-2">
                {current?.options.map((option, idx) => {
                  const isSelected = answers[currentIndex] === idx;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setAnswers((prev) => {
                          const next = [...prev];
                          next[currentIndex] = idx;
                          return next;
                        });
                      }}
                      className={`w-full rounded-xl px-4 py-3 text-left text-sm ring-1 transition ${
                        isSelected
                          ? "bg-white/15 text-white ring-[#FFC400]/45"
                          : "bg-white/5 text-white/90 ring-white/12 hover:bg-white/10"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold ring-1 ring-white/15 hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Previous
                </button>
                <div className="flex items-center gap-2">
                  {currentIndex < questions.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                      className="rounded-xl bg-[#FFC400] px-4 py-2.5 text-sm font-semibold text-black ring-1 ring-[#FF9100]/40 hover:bg-[#FF9100]"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setFinished(true)}
                      className="rounded-xl bg-[#FFC400] px-4 py-2.5 text-sm font-semibold text-black ring-1 ring-[#FF9100]/40 hover:bg-[#FF9100]"
                    >
                      Submit exam
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
