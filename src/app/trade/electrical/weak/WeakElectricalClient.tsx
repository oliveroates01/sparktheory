"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth } from "@/lib/firebase";
import { db } from "@/lib/firebase";
import { normalizeManualOverride, resolvePlusAccess } from "@/lib/entitlements";
import {
  getAttemptsKey,
  loadAttempts,
  getMasteryByTopic,
} from "@/lib/progress/attempts";
import { getMissedKey, loadMissedMap, type MissedMap } from "@/lib/progress/missed";
import {
  ELECTRICAL_LEVEL2_CATEGORIES,
  ELECTRICAL_LEVEL3_CATEGORIES,
} from "@/data/electricalTopicCategories";
import { healthSafetyQuestions } from "@/data/healthSafety";
import { principlesElectricalScienceQuestions } from "@/data/principlesElectricalScience";
import { electricalInstallationTechnologyQuestions } from "@/data/ElectricalInstallationTechnology";
import { installationWiringQuestions } from "@/data/installationWiring";
import { communicationWithinBSEQuestions } from "@/data/communicationWithinBSE";
import { principlesElectricalScienceLevel3Questions } from "@/data/principlesElectricalScienceLevel3";
import { electricalTechnologyLevel3Questions } from "@/data/electricalTechnologyLevel3";
import { inspectionTestingCommissioningLevel3Questions } from "@/data/inspectionTestingCommissioningLevel3";

const PLUS_ACCESS_CACHE_PREFIX = "qm_plus_access_";

type Question = {
  id: string;
  topic: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation?: string;
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

type MissedGroup = {
  topic: string;
  title: string;
  questions: Array<{
    id: string;
    text: string;
    wrong: number;
    options?: [string, string, string, string];
    correctIndex?: number;
    lastPickedOptionIndex?: number;
    selectedOptionId?: string;
    selectedOptionText?: string;
    correctOptionId?: string;
    explanation?: string;
  }>;
};

function scopedKey(baseKey: string, userId?: string | null) {
  return userId ? `${baseKey}__uid_${userId}` : baseKey;
}

function problemKeyForTopic(level: "2" | "3", topic: string, userId?: string | null) {
  return scopedKey(`qm_problem_${level}_${topic}`, userId);
}

function loadProblemStats(key: string): ProblemStats {
  try {
    const raw = JSON.parse(localStorage.getItem(key) || "{}");
    if (!raw || typeof raw !== "object") return {};
    return raw as ProblemStats;
  } catch {
    return {};
  }
}

function parseTopicFromHref(href?: string) {
  if (!href) return "";
  const q = href.split("?")[1] || "";
  const sp = new URLSearchParams(q);
  return (sp.get("topic") || "").trim().toLowerCase();
}

function levelTopics(level: "2" | "3") {
  const categories =
    level === "3" ? ELECTRICAL_LEVEL3_CATEGORIES : ELECTRICAL_LEVEL2_CATEGORIES;
  return categories
    .map((c) => ({ topic: parseTopicFromHref(c.href), title: c.title }))
    .filter((c) => c.topic && c.topic !== "all-level-2" && c.topic !== "all-level-3");
}

function rawBankForTopic(topic: string, level: "2" | "3"): unknown[] {
  if (topic === "principles-electrical-science") {
    return level === "3"
      ? (principlesElectricalScienceLevel3Questions as unknown[])
      : (principlesElectricalScienceQuestions as unknown[]);
  }
  if (topic === "electrical-technology") return electricalTechnologyLevel3Questions as unknown[];
  if (topic === "inspection-testing-commissioning") {
    return inspectionTestingCommissioningLevel3Questions as unknown[];
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

function toQuestions(raw: unknown[], fallbackTopic: string): Question[] {
  const out: Question[] = [];
  for (let i = 0; i < raw.length; i += 1) {
    const rec = raw[i] as Record<string, unknown>;
    if (!rec || typeof rec !== "object") continue;
    const id = typeof rec.id === "string" ? rec.id : `q-${i + 1}`;
    const question = typeof rec.question === "string" ? rec.question : "";
    const optionsRaw = rec.options;
    const options =
      Array.isArray(optionsRaw) &&
      optionsRaw.length === 4 &&
      optionsRaw.every((item) => typeof item === "string")
        ? (optionsRaw as [string, string, string, string])
        : null;
    const correctIndex =
      typeof rec.correctIndex === "number" && rec.correctIndex >= 0 && rec.correctIndex <= 3
        ? rec.correctIndex
        : null;
    if (!question) continue;
    out.push({
      id,
      topic:
        typeof rec.topic === "string" && rec.topic.trim()
          ? rec.topic.trim().toLowerCase()
          : fallbackTopic,
      question,
      options: options ?? ["", "", "", ""],
      correctIndex: correctIndex ?? 0,
      explanation: typeof rec.explanation === "string" ? rec.explanation : undefined,
    });
  }
  return out;
}

export default function WeakElectricalClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [masteryByTopic, setMasteryByTopic] = useState<Record<string, number>>({});
  const [weakTopics, setWeakTopics] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [missedGroups, setMissedGroups] = useState<MissedGroup[]>([]);
  const [openMissedKey, setOpenMissedKey] = useState<string | null>(null);
  const [hasAttemptedWeakTopics, setHasAttemptedWeakTopics] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [hasPlusAccess, setHasPlusAccess] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [subscriptionReady, setSubscriptionReady] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);

  const level: "2" | "3" = searchParams.get("level") === "3" ? "3" : "2";
  const validTopicRows = useMemo(() => levelTopics(level), [level]);
  const validTopics = useMemo(() => validTopicRows.map((row) => row.topic), [validTopicRows]);
  const validTopicSet = useMemo(() => new Set(validTopics), [validTopics]);
  const topicTitleByKey = useMemo(
    () => new Map(validTopicRows.map((row) => [row.topic, row.title])),
    [validTopicRows]
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
    const bump = () => setRefreshTick((n) => n + 1);
    const onStorage = (e: StorageEvent) => {
      if (!e.key) return;
      if (e.key.includes("qm_problem_") || e.key.includes("qm_missed_v1:electrical:")) {
        bump();
      }
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", bump);
    window.addEventListener("pageshow", bump);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", bump);
      window.removeEventListener("pageshow", bump);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const attemptsKey = getAttemptsKey("electrical", level, currentUserId);
    const levelAttempts = loadAttempts(attemptsKey).filter(
      (attempt) =>
        attempt.trade === "electrical" &&
        attempt.level === level &&
        attempt.mode !== "flashcards"
    );
    const missedMap = loadMissedMap(getMissedKey("electrical", level, currentUserId));

    const mastery = getMasteryByTopic({
      trade: "electrical",
      level,
      userId: currentUserId,
    });
    const masteryForLevelTopics = Object.fromEntries(
      Object.entries(mastery).filter(([topic]) => validTopicSet.has(topic))
    );
    setMasteryByTopic(masteryForLevelTopics);
    const attemptedTopicSet = new Set(
      levelAttempts
        .map((attempt) => (attempt.topicKey || "").trim().toLowerCase())
        .filter((topic) => topic && topic !== "all-level-2" && topic !== "all-level-3")
        .filter((topic) => validTopicSet.has(topic))
    );
    const attemptedTopics = validTopics.filter((topic) => attemptedTopicSet.has(topic));
    setHasAttemptedWeakTopics(attemptedTopics.length > 0);
    setWeakTopics(attemptedTopics);
    setSelectedTopics([]);

    const groups: MissedGroup[] = [];

    for (const item of validTopicRows) {
      const stats = loadProblemStats(problemKeyForTopic(level, item.topic, currentUserId));
      const bank = toQuestions(rawBankForTopic(item.topic, level), item.topic);
      const byId = new Map(bank.map((q) => [q.id, q]));
      const byText = new Map(bank.map((q) => [q.question.trim().toLowerCase(), q]));
      const legacyMissed = Object.entries(stats).map(([statKey, stat]) => {
        const fromId = byId.get(statKey);
        const fromStatText =
          typeof stat.questionText === "string" && stat.questionText.trim()
            ? byText.get(stat.questionText.trim().toLowerCase())
            : undefined;
        const fromKeyText = byText.get(statKey.trim().toLowerCase());
        const resolved = fromId || fromStatText || fromKeyText;
        return {
          id: resolved?.id || statKey,
          text: resolved?.question || stat.questionText || statKey,
          wrong: Number(stat.missedCount ?? stat.wrong ?? 0),
          options: resolved?.options,
          correctIndex: resolved?.correctIndex,
          lastPickedOptionIndex: Number.isFinite(stat.lastPickedOptionIndex)
            ? Number(stat.lastPickedOptionIndex)
            : undefined,
          selectedOptionId:
            typeof stat.selectedOptionId === "string" ? stat.selectedOptionId : undefined,
          selectedOptionText:
            typeof stat.selectedOptionText === "string" ? stat.selectedOptionText : undefined,
          correctOptionId:
            typeof stat.correctOptionId === "string" ? stat.correctOptionId : undefined,
          explanation: resolved?.explanation,
        };
      });
      const legacyById = new Map(legacyMissed.map((entry) => [entry.id, entry]));
      const fromBank = bank
        .map((q) => {
          const legacy = legacyById.get(q.id);
          const missedEntry = missedMap[q.id];
          const wrong = Number(missedEntry?.missedCount ?? legacy?.wrong ?? 0);
          return {
            id: q.id,
            text: q.question,
            wrong,
            options: q.options,
            correctIndex: q.correctIndex,
            lastPickedOptionIndex: legacy?.lastPickedOptionIndex,
            selectedOptionId: missedEntry?.lastSelectedOptionId || legacy?.selectedOptionId,
            selectedOptionText: missedEntry?.lastSelectedOptionText || legacy?.selectedOptionText,
            correctOptionId: legacy?.correctOptionId,
            explanation: q.explanation,
          };
        })
        .filter((q) => q.wrong > 0);
      const unresolvedLegacy = legacyMissed.filter(
        (entry) => !byId.has(entry.id) && Number(entry.wrong || 0) > 0
      );
      const seen = new Set<string>();
      const missed = [...fromBank, ...unresolvedLegacy]
        .filter((q) => {
          if (seen.has(q.id)) return false;
          seen.add(q.id);
          return true;
        })
        .sort((a, b) => b.wrong - a.wrong)
        .slice(0, 8);

      if (missed.length > 0) {
        groups.push({
          topic: item.topic,
          title: item.title,
          questions: missed,
        });
      }
    }

    setMissedGroups(groups);
  }, [level, currentUserId, validTopicRows, validTopics, validTopicSet, refreshTick]);

  const setLevelParam = (nextLevel: "2" | "3") => {
    if (nextLevel === level) return;
    router.replace(`/trade/electrical/weak?level=${nextLevel}`, { scroll: false });
  };

  const startWeakQuiz = () => {
    const topicsToUse = selectedTopics;
    if (topicsToUse.length === 0) return;
    const params = new URLSearchParams({
      trade: "electrical",
      mode: "weak",
      level,
      topics: topicsToUse.join(","),
    });
    router.push(`/quiz?${params.toString()}`, { scroll: false });
  };

  const toggleTopicSelection = (topic: string) => {
    const allowedTopicSet = new Set(weakTopics);
    setSelectedTopics((prev) => {
      if (!allowedTopicSet.has(topic)) return prev;
      if (prev.includes(topic)) return prev.filter((item) => item !== topic);
      const maxSelectable = Math.max(1, weakTopics.length);
      if (prev.length >= maxSelectable) return prev;
      return [...prev, topic];
    });
  };

  const weakTopicRows = useMemo(
    () =>
      weakTopics.map((topic) => ({
        topic,
        mastery: masteryByTopic[topic],
      })),
    [weakTopics, masteryByTopic]
  );
  return (
    <main className="min-h-screen bg-[#1F1F1F] text-white page-transition">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#FFC400]/25 via-[#FF9100]/20 to-[#FFC400]/20 blur-3xl" />
        <div className="absolute bottom-[-220px] right-[-200px] h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-[#FFC400]/18 to-[#FF9100]/12 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_30%_20%,rgba(255,196,0,0.14),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(700px_420px_at_70%_80%,rgba(255,145,0,0.12),transparent_60%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-6 py-10">
        <section className="mx-auto w-full max-w-5xl">
          <div className="flex items-center justify-between gap-3">
            <Link
              href={level === "3" ? "/trade/electrical?level=3" : "/trade/electrical?level=2"}
              className="inline-flex rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/10"
            >
              Back
            </Link>
            <button
              type="button"
              onClick={startWeakQuiz}
              disabled={selectedTopics.length === 0}
              className="rounded-xl bg-[#FFC400] px-4 py-2.5 text-sm font-semibold text-black ring-1 ring-[#FF9100]/40 hover:bg-[#FF9100] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Start Weak Quiz
            </button>
          </div>

          <div className="mt-6 mx-auto grid w-full max-w-2xl grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setLevelParam("2")}
              className={`rounded-md px-3 py-2 text-left ring-1 transition ${
                level === "2"
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
                level === "3"
                  ? "bg-white/10 ring-[#FFC400]/50 shadow-[0_0_0_1px_rgba(255,196,0,0.28),0_10px_24px_rgba(255,145,0,0.18)]"
                  : "bg-white/5 ring-white/10 hover:bg-white/10 hover:ring-[#FFC400]/40"
              }`}
            >
              <div className="mt-0.5 text-[13px] font-semibold text-white">Level 3 Electrical</div>
            </button>
          </div>

          <div className="mt-6 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
            <h2 className="text-lg font-semibold">Pick weak topics</h2>
            {hasAttemptedWeakTopics ? (
              <div className="mt-3 space-y-2">
                {weakTopicRows.map((row) => (
                  <label
                    key={row.topic}
                    className="flex items-center justify-between gap-3 rounded-lg bg-black/25 px-3 py-2 text-sm ring-1 ring-white/10"
                  >
                    <span className="flex flex-1 items-center gap-3 min-w-0">
                      <input
                        type="checkbox"
                        checked={selectedTopics.includes(row.topic)}
                        onChange={() => toggleTopicSelection(row.topic)}
                        disabled={
                          !selectedTopics.includes(row.topic) &&
                          selectedTopics.length >= Math.max(1, weakTopics.length)
                        }
                        className="h-4 w-4 shrink-0 rounded border-white/30 bg-black/20 accent-[#FFC400] disabled:opacity-50"
                      />
                      <span className="flex-1 min-w-0 text-white/85">
                        {topicTitleByKey.get(row.topic) || row.topic}
                      </span>
                    </span>
                    <span className="shrink-0 font-semibold text-white">
                      {Number.isFinite(row.mastery) ? `${Math.round(row.mastery)}%` : "—"}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-white/65">
                No weak topics yet — do a quiz first.
              </p>
            )}
            {hasAttemptedWeakTopics && selectedTopics.length === 0 ? (
              <p className="mt-2 text-sm text-white/60">Select at least one topic</p>
            ) : null}
          </div>

          <div className="mt-6 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
            <h2 className="text-lg font-semibold">Previously missed questions</h2>
            {missedGroups.length === 0 ? (
              <p className="mt-3 text-sm text-white/65">No missed questions recorded yet.</p>
            ) : (
              <div className="mt-3 space-y-4">
                {missedGroups.map((group) => (
                  <div key={group.topic} className="space-y-2">
                    <h3 className="text-sm font-semibold text-white/85">{group.title}</h3>
                    {group.questions.map((question) => (
                      <div key={question.id} className="rounded-lg bg-black/25 ring-1 ring-white/10">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMissedKey((prev) => (prev === question.id ? null : question.id))
                          }
                          className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm text-white/75"
                        >
                          <div className="min-w-0">
                            <div className="truncate">{question.text}</div>
                            <div className="mt-1 text-xs text-rose-200">Missed {question.wrong} times</div>
                          </div>
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 20 20"
                            className={`h-4 w-4 shrink-0 text-white/60 transition-transform ${
                              openMissedKey === question.id ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M5 8l5 5 5-5" />
                          </svg>
                        </button>
                        {openMissedKey === question.id && (
                          <div className="mx-3 mb-3 rounded-lg bg-white/5 p-3 text-sm ring-1 ring-white/10">
                            <div className="text-white/85">{question.text}</div>
                            <div className="mt-3 space-y-2">
                              {(question.options || []).map((option, idx) => {
                                const isCorrect = idx === question.correctIndex;
                                const isPicked = idx === question.lastPickedOptionIndex;
                                return (
                                  <div
                                    key={`${question.id}-${idx}`}
                                    className={`rounded-md px-3 py-2 text-xs ring-1 ${
                                      isCorrect
                                        ? "bg-emerald-500/15 text-emerald-100 ring-emerald-400/30"
                                        : isPicked
                                        ? "bg-rose-500/15 text-rose-100 ring-rose-400/30"
                                        : "bg-white/5 text-white/60 ring-white/10"
                                    }`}
                                  >
                                    <span className="font-semibold text-white/75">
                                      {String.fromCharCode(65 + idx)}.
                                    </span>{" "}
                                    {option}
                                  </div>
                                );
                              })}
                            </div>
                            {typeof question.lastPickedOptionIndex === "number" &&
                            (typeof question.selectedOptionText === "string" &&
                            question.selectedOptionText.trim() ? (
                              <div className="mt-3 text-xs text-rose-200">
                                You picked:{" "}
                                <span className="font-semibold">
                                  {question.selectedOptionText}
                                </span>
                              </div>
                            ) : question.options &&
                              typeof question.lastPickedOptionIndex === "number" &&
                              question.lastPickedOptionIndex >= 0 &&
                              question.lastPickedOptionIndex < question.options.length ? (
                              <div className="mt-3 text-xs text-rose-200">
                                You picked:{" "}
                                <span className="font-semibold">
                                  {question.options[question.lastPickedOptionIndex]}
                                </span>
                              </div>
                            ) : null)}
                            {question.explanation ? (
                              <div className="mt-3 rounded-md bg-white/5 px-3 py-2 text-xs text-white/70 ring-1 ring-white/10">
                                {question.explanation}
                              </div>
                            ) : null}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
