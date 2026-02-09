"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

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

const STORAGE_KEY_LEVEL2 = "qm_results_v1";
const STORAGE_KEY_LEVEL3 = "qm_results_v1_level3";
const DEFAULT_QUIZ_SIZE = 4;

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

function loadSeenIds(key: string): Set<string> {
  try {
    const raw = JSON.parse(localStorage.getItem(key) || "[]");
    if (!Array.isArray(raw)) return new Set();
    return new Set(raw.filter((x) => typeof x === "string"));
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
    return raw as ProblemStats;
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
  const question = typeof raw.question === "string" ? raw.question : "";
  const options = toStringArray4(raw.options);
  const correctIndex = toNumber(raw.correctIndex);
  const explanation =
    typeof raw.explanation === "string"
      ? raw.explanation
      : "No explanation yet.";

  if (!question || !options || correctIndex === null) return null;
  if (correctIndex < 0 || correctIndex > 3) return null;

  return { id, question, options, correctIndex, explanation };
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

export default function QuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const topic = (searchParams.get("topic") ?? "").trim().toLowerCase();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUserLoggedIn(Boolean(user));
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
  const isLocked = ((level === "3" && LOCKED_LEVEL3_TOPICS.has(topic)) || (level !== "3" && LOCKED_LEVEL2_TOPICS.has(topic))) && !userLoggedIn;

  useEffect(() => {
    if (isLocked) router.replace("/login");
  }, [isLocked, router]);

  const bank = useMemo<Question[]>(() => {
    let rawBank: unknown[] = [];

    if (topic === "all-level-2") {
      rawBank = [
        ...(healthSafetyQuestions as unknown[]),
        ...(principlesElectricalScienceQuestions as unknown[]),
        ...(electricalInstallationTechnologyQuestions as unknown[]),
        ...(installationWiringQuestions as unknown[]),
        ...(communicationWithinBSEQuestions as unknown[]),
      ];
    } else if (topic === "principles-electrical-science") {
      rawBank =
        level === "3"
          ? (principlesElectricalScienceLevel3Questions as unknown[])
          : (principlesElectricalScienceQuestions as unknown[]);
    } else if (topic === "electrical-technology") {
      rawBank =
        level === "3"
          ? (electricalTechnologyLevel3Questions as unknown[])
          : (electricalInstallationTechnologyQuestions as unknown[]);
    } else if (topic === "inspection-testing-commissioning") {
      rawBank =
        level === "3"
          ? (inspectionTestingCommissioningLevel3Questions as unknown[])
          : (installationWiringQuestions as unknown[]);
    } else if (topic === "electrical-installation-technology") {
      rawBank = electricalInstallationTechnologyQuestions as unknown[];
    } else if (topic === "installation-wiring-systems-enclosures") {
      rawBank = installationWiringQuestions as unknown[];
    } else if (topic === "communication-within-building-services-engineering") {
      rawBank = communicationWithinBSEQuestions as unknown[];
    } else {
      rawBank = healthSafetyQuestions as unknown[];
    }

    const normalized = rawBank
      .map((q, i) => normalizeQuestion(q, i))
      .filter((q): q is Question => Boolean(q));

    if (typeof window === "undefined") return normalized;

    if (problemsOnly && topic) {
      const pKey = problemKeyForTopic(level, topic);
      const stats = loadProblemStats(pKey);
      const problemOnly = normalized
        .filter((q) => (stats[q.id]?.wrong ?? 0) > 0)
        .sort(
          (a, b) =>
            (stats[b.id]?.wrong ?? 0) - (stats[a.id]?.wrong ?? 0)
        );
      return problemOnly.length > 0 ? problemOnly : [];
    }

    if (!unseenOnly || !topic) return normalized;

    const seenKey = seenKeyForTopic(level, topic);
    const seen = loadSeenIds(seenKey);
    if (seen.size === 0) return normalized;

    const unseen = normalized.filter((q) => !seen.has(q.id));
    return unseen.length > 0 ? unseen : normalized;
  }, [topic, level, unseenOnly, problemsOnly]);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Array<number | null>>([]);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showProblemsList, setShowProblemsList] = useState(problemsOnly);

  // prevent saving twice
  const [hasSaved, setHasSaved] = useState(false);

  // end-of-exam chart: only this topic results
  const [topicResults, setTopicResults] = useState<StoredResult[]>([]);

  // ✅ track quiz start time so we can save "time taken"
  const startedAtMsRef = useRef<number>(Date.now());

  useEffect(() => {
    setShowProblemsList(problemsOnly);
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
    }
  }, [showProblemsList]);

  const buildNewQuiz = () => {
    const picked = shuffle(bank)
      .slice(0, Math.min(quizSize, bank.length))
      .map(shuffleQuestionOptions);

    startedAtMsRef.current = Date.now(); // ✅ reset timer

    setQuestions(picked);
    setCurrentIndex(0);
    setSelected(null);
    setAnswers(Array(picked.length).fill(null));
    setScore(0);
    setFinished(false);
    setHasSaved(false);
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
  };

  useEffect(() => {
    if (bank.length === 0) {
    setQuestions([]);
    setCurrentIndex(0);
    setSelected(null);
    setAnswers([]);
    setScore(0);
    setFinished(false);
    setHasSaved(false);
    setTopicResults([]);
    return;
    }
    if (!showProblemsList) buildNewQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic, bank.length, quizSize, showProblemsList]);

  useEffect(() => {
    if (!finished || !topic || questions.length === 0) return;
    const seenKey = seenKeyForTopic(level, topic);
    const seen = loadSeenIds(seenKey);
    questions.forEach((q) => seen.add(q.id));
    saveSeenIds(seenKey, seen);
  }, [finished, questions, topic, level]);

  const current = questions[currentIndex] ?? null;

  const onPick = (idx: number) => {
    if (!current || selected !== null) return;
    setSelected(idx);
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = idx;
      return next;
    });
    if (typeof window !== "undefined" && topic) {
      const pKey = problemKeyForTopic(level, topic);
      const stats = loadProblemStats(pKey);
      const existing = stats[current.id] || { wrong: 0, total: 0 };
      const wrong = idx === current.correctIndex ? 0 : 1;
      stats[current.id] = {
        wrong: existing.wrong + wrong,
        total: existing.total + 1,
      };
      saveProblemStats(pKey, stats);
    }
    if (idx === current.correctIndex) setScore((s) => s + 1);
  };

  const onNext = () => {
    if (selected === null) return;

    const next = currentIndex + 1;
    if (next >= questions.length) {
      setFinished(true);
      return;
    }

    setCurrentIndex(next);
    setSelected(null);
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

    if (selected === null) return `${base} hover:bg-white/10`;

    const isCorrect = current && idx === current.correctIndex;
    const isPicked = idx === selected;
    const pickedWrong = isPicked && idx !== current?.correctIndex;

    if (isCorrect) return `${base} !bg-emerald-600 !border-emerald-500 !text-white`;
    if (pickedWrong) return `${base} !bg-rose-600 !border-rose-500 !text-white`;

    return `${base} opacity-50`;
  };

  return (
    <main className="min-h-screen bg-[#1F1F1F] text-white">
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
            <div className="mt-4 space-y-3">
              {bank.map((q) => (
                <div
                  key={q.id}
                  className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white/80"
                >
                  {q.question}
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

            {selected !== null && (
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
                {currentIndex + 1 === questions.length ? "Finish" : "Next"}
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
