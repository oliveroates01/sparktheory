"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ProgressReport, { type StoredResult } from "@/components/ProgressReport";
import { principlesElectricalScienceLevel3Questions } from "@/data/principlesElectricalScienceLevel3";
import { electricalTechnologyLevel3Questions } from "@/data/electricalTechnologyLevel3";
import { inspectionTestingCommissioningLevel3Questions } from "@/data/inspectionTestingCommissioningLevel3";

type Category = {
  id: string;
  title: string;
  description: string;
  tag: string;
  href?: string;
  topicHref?: string;
};

const STORAGE_KEY = "qm_results_v1_level3";

function loadResults(): StoredResult[] {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(raw) ? (raw as StoredResult[]) : [];
  } catch {
    return [];
  }
}

function getTopicFromHref(href?: string) {
  if (!href) return "";
  const q = href.split("?")[1] || "";
  const sp = new URLSearchParams(q);
  return (sp.get("topic") || "").trim().toLowerCase();
}

function seenKeyForTopic(level: "3", topic: string) {
  const safeTopic = topic || "unknown";
  return `qm_seen_${level}_${safeTopic}`;
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

function totalQuestionsFor(topic: string) {
  if (topic === "principles-electrical-science") {
    return principlesElectricalScienceLevel3Questions.length;
  }
  if (topic === "electrical-technology") {
    return electricalTechnologyLevel3Questions.length;
  }
  if (topic === "inspection-testing-commissioning") {
    return inspectionTestingCommissioningLevel3Questions.length;
  }
  return 0;
}

const CATEGORIES: Category[] = [
  {
    id: "principles-electrical-science",
    title: "Principles of Electrical Science",
    description:
      "Advanced theory, calculations, magnetism, induction, and electronic components.",
    tag: "Electrical",
    href: "/quiz?trade=electrical&topic=principles-electrical-science&level=3",
    topicHref: "/trade/electrical/principles-electrical-science?level=3",
  },
  {
    id: "electrical-technology",
    title: "Electrical Technology",
    description:
      "Regulations, technical information, supply systems, intake and earthing, and consumer installations.",
    tag: "Electrical",
    href: "/quiz?trade=electrical&topic=electrical-technology&level=3",
    topicHref: "/trade/electrical/electrical-technology?level=3",
  },
  {
    id: "inspection-testing-commissioning",
    title: "Inspection, Testing & Commissioning",
    description:
      "Initial verification, schedules of inspection, and key test requirements.",
    tag: "Electrical",
    href: "/quiz?trade=electrical&topic=inspection-testing-commissioning&level=3",
    topicHref: "/trade/electrical/inspection-testing-commissioning?level=3",
  },
];

export default function ElectricalLevel3Page() {
  const [results, setResults] = useState<StoredResult[]>(() => {
    if (typeof window === "undefined") return [];
    return loadResults();
  });
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickedHref, setPickedHref] = useState<string | null>(null);
  const [unseenOnly, setUnseenOnly] = useState(false);
  const [unseenCount, setUnseenCount] = useState<number | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  const sizes = [5, 15, 30, 50];

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setResults(loadResults());
    };
    window.addEventListener("storage", onStorage);

    const onFocus = () => setResults(loadResults());
    window.addEventListener("focus", onFocus);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const resultsOldestToNewest = useMemo(() => {
    return [...results].sort((a, b) => {
      const ta = a.date ? new Date(a.date).getTime() : 0;
      const tb = b.date ? new Date(b.date).getTime() : 0;
      return ta - tb;
    });
  }, [results]);

  const topics = useMemo(
    () => CATEGORIES.map((c) => getTopicFromHref(c.href)).filter(Boolean),
    []
  );

  const openPicker = (href?: string) => {
    if (!href) return;
    setPickedHref(href);
    setPickerOpen(true);
  };

  const closePicker = () => {
    setPickerOpen(false);
    setPickedHref(null);
  };

  const resetProgress = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setResults([]);
  };

  useEffect(() => {
    if (!pickerOpen || !pickedHref) {
      setUnseenCount(null);
      setTotalCount(null);
      return;
    }
    const topic = getTopicFromHref(pickedHref);
    const total = totalQuestionsFor(topic);
    setTotalCount(total);

    if (typeof window === "undefined" || !topic) {
      setUnseenCount(null);
      return;
    }
    const seenKey = seenKeyForTopic("3", topic);
    const seen = loadSeenIds(seenKey);
    const unseen = Math.max(total - seen.size, 0);
    setUnseenCount(unseen);
  }, [pickerOpen, pickedHref]);

  return (
    <main className="min-h-screen bg-[#1F1F1F] text-white page-transition">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#FFC400]/25 via-[#FF9100]/20 to-[#FFC400]/20 blur-3xl" />
        <div className="absolute bottom-[-220px] right-[-200px] h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-[#FFC400]/18 to-[#FF9100]/12 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_30%_20%,rgba(255,196,0,0.14),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(700px_420px_at_70%_80%,rgba(255,145,0,0.12),transparent_60%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-6 py-10">
        {/* Header */}
        <header className="flex items-start justify-between">
          <div>
            <Link href="/topics" className="flex items-center gap-3 group">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-400/20 ring-1 ring-amber-300/30 transition group-hover:bg-amber-400/25">
                <span className="text-xl">⚡</span>
              </div>

              <div>
                <p className="text-sm font-semibold tracking-wide">Spark Theory</p>
                <p className="text-xs text-white/60">Electrical Guide · Level 3</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/account"
              className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/15 hover:bg-white/15"
            >
              Account
            </Link>
          </div>
        </header>

        {/* Title */}
        <section className="mt-10">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
            Electrical <span className="text-[#FFC400]">Guide</span>
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-white/70 sm:text-base">
            Level 3 topics — advanced concepts, calculations, and exam readiness.
          </p>
          <p className="mt-4 text-sm text-white/60">{CATEGORIES.length} categories</p>
        </section>

        {/* Search */}
        <section className="mt-6">
          <div className="flex max-w-3xl items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
            <span className="text-white/50">🔎</span>
            <input
              placeholder="Search Electrical..."
              className="w-full bg-transparent text-sm text-white/80 placeholder:text-white/40 outline-none"
            />
          </div>
        </section>

        {/* Levels */}
        <section className="mt-6">
          <div className="mx-auto grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
            <Link
              href="/trade/electrical"
              className="rounded-2xl bg-white/5 px-5 py-4 text-left ring-1 ring-white/10 transition hover:bg-white/10 hover:ring-[#FFC400]/50"
            >
              <div className="text-xs text-white/60">Level 2</div>
              <div className="mt-1 text-lg font-semibold text-white">
                Level 2 Electrical
              </div>
              <div className="mt-1 text-xs text-white/60">
                Core foundations and safety principles.
              </div>
            </Link>

            <div className="rounded-2xl bg-white/5 px-5 py-4 text-left ring-1 ring-white/20">
              <div className="text-xs text-white/60">Level 3</div>
              <div className="mt-1 text-lg font-semibold text-white">
                Level 3 Electrical
              </div>
              <div className="mt-1 text-xs text-white/60">
                Advanced concepts and exam readiness.
              </div>
            </div>
          </div>
        </section>

        {/* Main Progress Chart (top) */}
        <section className="mt-10 mx-auto max-w-4xl">
          <ProgressReport
            results={resultsOldestToNewest ?? []}
            topics={topics ?? []}
            onResetProgress={resetProgress}
          />
        </section>

        {/* Cards */}
        <section className="mt-8 mx-auto max-w-6xl">
          <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
            {CATEGORIES.map((c) => (
              <div
                key={c.id}
                className="flex h-full flex-col rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 transition hover:bg-white/10 hover:ring-white/15"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-bold leading-snug">{c.title}</h3>

                  <div className="shrink-0 inline-flex items-center gap-2">
                    {c.topicHref ? (
                      <Link
                        href={c.topicHref}
                        aria-label={`Open ${c.title} topic`}
                        className="inline-flex h-6 w-6 items-center justify-center rounded-md text-white/70 ring-1 ring-white/10 hover:text-white hover:ring-white/20"
                      >
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="6" y="4.5" width="12" height="16" rx="2" />
                          <path d="M9 4.5v3h6v-3" />
                          <path d="M9.5 11h5" />
                          <path d="M9.5 14h5" />
                        </svg>
                      </Link>
                    ) : (
                      <span className="inline-flex h-6 w-6 items-center justify-center text-white/70">
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="6" y="4.5" width="12" height="16" rx="2" />
                          <path d="M9 4.5v3h6v-3" />
                          <path d="M9.5 11h5" />
                          <path d="M9.5 14h5" />
                        </svg>
                      </span>
                    )}
                    <span className="rounded-full bg-amber-400/25 px-3 py-1 text-xs font-semibold text-amber-200 ring-1 ring-amber-300/30">
                      {c.tag}
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-sm leading-5 text-white/70">{c.description}</p>

                <button
                  type="button"
                  onClick={() => openPicker(c.href)}
                  className="mt-auto block w-full rounded-xl bg-[#FFC400] px-4 py-3 text-center text-sm font-semibold text-white shadow-sm shadow-[#FF9100]/20 hover:bg-[#FF9100]"
                >
                  Start Quiz
                </button>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-14 rounded-2xl bg-black/40 px-6 py-8 text-center text-xs text-white/60 ring-1 ring-white/10">
          <div className="text-sm font-semibold text-white/80">
            © {new Date().getFullYear()} Spark Theory. All rights reserved.
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-4 text-xs text-white/70">
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
            <Link href="/refunds" className="hover:text-white">
              Refunds
            </Link>
          </div>
          <p className="mt-4 text-xs text-white/55">
            All content, including questions, images, and reference materials, is
            protected by copyright and may not be reproduced, distributed, or
            used without permission.
          </p>
        </footer>
      </div>

      {/* Quiz size picker modal */}
      {pickerOpen && pickedHref && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-6"
          onClick={closePicker}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-[#1F1F1F] p-6 ring-1 ring-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold">Choose quiz size</h3>
            <p className="mt-1 text-sm text-white/60">How many questions do you want?</p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {sizes.map((n) => (
                <Link
                  key={n}
                  href={`${pickedHref}&n=${n}${unseenOnly ? "&unseen=1" : ""}`}
                  className="rounded-xl bg-white/10 px-4 py-3 text-center text-sm font-semibold ring-1 ring-white/15 hover:bg-white/15"
                  onClick={closePicker}
                >
                  {n} questions
                </Link>
              ))}
            </div>

            <label className="mt-5 flex items-center gap-2 text-sm text-white/70">
              <input
                type="checkbox"
                checked={unseenOnly}
                onChange={(e) => setUnseenOnly(e.target.checked)}
                className="h-4 w-4 rounded border-white/30 bg-white/10 text-blue-500"
              />
              Unseen questions only
            </label>
            {totalCount !== null && unseenCount !== null && (
              <p className="mt-2 text-xs text-white/50">
                Unseen in this topic: {unseenCount} of {totalCount}
              </p>
            )}
            {unseenOnly && unseenCount === 0 && (
              <p className="mt-2 text-xs text-white/50">
                All questions have been seen — you’ll get the full set.
              </p>
            )}

            <button
              type="button"
              onClick={closePicker}
              className="mt-5 w-full rounded-xl bg-white/5 px-4 py-3 text-sm font-semibold ring-1 ring-white/10 hover:bg-white/10"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
