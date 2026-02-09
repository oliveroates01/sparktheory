"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ProgressReport, { type StoredResult } from "@/components/ProgressReport";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { healthSafetyQuestions } from "@/data/healthSafety";
import { principlesElectricalScienceQuestions } from "@/data/principlesElectricalScience";
import { electricalInstallationTechnologyQuestions } from "@/data/ElectricalInstallationTechnology";
import { installationWiringQuestions } from "@/data/installationWiring";
import { communicationWithinBSEQuestions } from "@/data/communicationWithinBSE";
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

const LOCKED_LEVEL2_TOPICS = new Set([
  "electrical-installation-technology",
  "installation-wiring-systems-enclosures",
  "communication-within-building-services-engineering",
]);
const LOCKED_LEVEL3_TOPICS = new Set([
  "electrical-technology",
  "inspection-testing-commissioning",
]);


const STORAGE_KEY_LEVEL2 = "qm_results_v1";
const STORAGE_KEY_LEVEL3 = "qm_results_v1_level3";
const SCROLL_RESTORE_KEY = "qm_scroll_trade_electrical";

function storageKeyForLevel(level: "2" | "3") {
  return level === "3" ? STORAGE_KEY_LEVEL3 : STORAGE_KEY_LEVEL2;
}

function loadResults(storageKey: string): StoredResult[] {
  try {
    const raw = JSON.parse(localStorage.getItem(storageKey) || "[]");
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

function getLevelFromHref(href?: string, fallback: "2" | "3" = "2") {
  if (!href) return fallback;
  const q = href.split("?")[1] || "";
  const sp = new URLSearchParams(q);
  return sp.get("level") === "3" ? "3" : fallback;
}

function seenKeyForTopic(level: "2" | "3", topic: string) {
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

function totalQuestionsFor(topic: string, level: "2" | "3") {
  if (level === "3") {
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

  if (topic === "principles-electrical-science") {
    return principlesElectricalScienceQuestions.length;
  }
  if (topic === "all-level-2") {
    return (
      healthSafetyQuestions.length +
      principlesElectricalScienceQuestions.length +
      electricalInstallationTechnologyQuestions.length +
      installationWiringQuestions.length +
      communicationWithinBSEQuestions.length
    );
  }
  if (topic === "electrical-installation-technology") {
    return electricalInstallationTechnologyQuestions.length;
  }
  if (topic === "installation-wiring-systems-enclosures") {
    return installationWiringQuestions.length;
  }
  if (topic === "communication-within-building-services-engineering") {
    return communicationWithinBSEQuestions.length;
  }
  return healthSafetyQuestions.length;
}

const CATEGORIES: Category[] = [
  {
    id: "all-level-2",
    title: "Level 2 Mixed (All Topics)",
    description:
      "All Level 2 topics combined for a full mixed practice quiz.",
    tag: "Electrical",
    href: "/quiz?trade=electrical&topic=all-level-2",
  },
  {
    id: "health-safety",
    title: "Health & Safety",
    description:
      "Key laws, risk assessments, PPE, safe isolation, and site safety basics.",
    tag: "Electrical",
    href: "/quiz?trade=electrical&topic=health-safety",
    topicHref: "/trade/electrical/health-safety",
  },
  {
    id: "principles-electrical-science",
    title: "Principles of Electrical Science",
    description:
      "Ohm’s law, voltage, current, resistance, power, and AC/DC fundamentals.",
    tag: "Electrical",
    href: "/quiz?trade=electrical&topic=principles-electrical-science",
    topicHref: "/trade/electrical/principles-electrical-science",
  },
  {
    id: "electrical-installation-technology",
    title: "Electrical Installation Technology",
    description:
      "Wiring systems, containment, terminations, circuit design basics, and installation methods.",
    tag: "Electrical",
    href: "/quiz?trade=electrical&topic=electrical-installation-technology",
    topicHref: "/trade/electrical/electrical-installation-technology",
  },
  {
    id: "installation-wiring-systems-enclosures",
    title: "Installation of Wiring Systems & Enclosures",
    description:
      "Cable routes, safe zones, containment (trunking/conduit), fixings, entries, and enclosures.",
    tag: "Electrical",
    href: "/quiz?trade=electrical&topic=installation-wiring-systems-enclosures",
    topicHref: "/trade/electrical/installation-wiring-systems-enclosures",
  },
  {
    id: "communication-within-building-services-engineering",
    title: "Communication within Building Services Engineering",
    description:
      "Communication methods, documentation, teamwork, and coordinating safely on site.",
    tag: "Electrical",
    href: "/quiz?trade=electrical&topic=communication-within-building-services-engineering",
    topicHref: "/trade/electrical/communication-within-building-services-engineering",
  },
];

const LEVEL3_CATEGORIES: Category[] = [
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

export default function ElectricalPage() {
  const [level, setLevel] = useState<"2" | "3">("2");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const storageKey = storageKeyForLevel(level);
  const [results, setResults] = useState<StoredResult[]>([]);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickedHref, setPickedHref] = useState<string | null>(null);
  const [unseenOnly, setUnseenOnly] = useState(false);
  const [problemOnly, setProblemOnly] = useState(false);
  const [isSwitchingLevel, setIsSwitchingLevel] = useState(false);
  const [unseenCount, setUnseenCount] = useState<number | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  const sizes = [5, 15, 30, 50];

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUserLoggedIn(Boolean(user));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const initialLevel = (searchParams.get("level") || "").trim();
    if (initialLevel === "2" || initialLevel === "3") {
      setLevel((prev) =>
        prev === initialLevel ? prev : (initialLevel as "2" | "3")
      );
    }
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (level === "3") {
      params.set("level", "3");
    } else {
      params.delete("level");
    }
    const qs = params.toString();
    const next = qs ? `${pathname}?${qs}` : pathname;
    router.replace(next);
  }, [level, pathname, router, searchParams]);

  useEffect(() => {
    const syncResults = () => setResults(loadResults(storageKey));
    syncResults();

    const onStorage = (e: StorageEvent) => {
      if (e.key === storageKey) syncResults();
    };
    window.addEventListener("storage", onStorage);

    const onFocus = () => syncResults();
    window.addEventListener("focus", onFocus);

    const onPageShow = () => syncResults();
    window.addEventListener("pageshow", onPageShow);

    const onVisibility = () => {
      if (!document.hidden) syncResults();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("pageshow", onPageShow);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [storageKey]);

  useEffect(() => {
    const param = (searchParams.get("level") || "").trim();
    if (param === "3") setLevel("3");
    if (param === "2") setLevel("2");
  }, [searchParams]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = sessionStorage.getItem(SCROLL_RESTORE_KEY);
    if (!saved) return;
    const y = Number(saved);
    if (Number.isFinite(y)) {
      requestAnimationFrame(() => window.scrollTo({ top: y, behavior: "auto" }));
    }
    sessionStorage.removeItem(SCROLL_RESTORE_KEY);
  }, []);

  const resultsOldestToNewest = useMemo(() => {
    return [...results].sort((a, b) => {
      const ta = a.date ? new Date(a.date).getTime() : 0;
      const tb = b.date ? new Date(b.date).getTime() : 0;
      return ta - tb;
    });
  }, [results]);

  const visibleCategories = useMemo(
    () => (level === "3" ? LEVEL3_CATEGORIES : CATEGORIES),
    [level]
  );

  const topics = useMemo(
    () => visibleCategories.map((c) => getTopicFromHref(c.href)).filter(Boolean),
    [visibleCategories]
  );

  useEffect(() => {
    setIsSwitchingLevel(true);
    const t = setTimeout(() => setIsSwitchingLevel(false), 200);
    return () => clearTimeout(t);
  }, [level]);

  useEffect(() => {
    if (!pickerOpen || !pickedHref) {
      setUnseenCount(null);
      setTotalCount(null);
      return;
    }
    const topic = getTopicFromHref(pickedHref);
    const lvl = getLevelFromHref(pickedHref, level);
    const total = totalQuestionsFor(topic, lvl);
    setTotalCount(total);

    if (typeof window === "undefined" || !topic) {
      setUnseenCount(null);
      return;
    }
    const seenKey = seenKeyForTopic(lvl, topic);
    const seen = loadSeenIds(seenKey);
    const unseen = Math.max(total - seen.size, 0);
    setUnseenCount(unseen);
  }, [pickerOpen, pickedHref, level]);

  const openPicker = (href?: string) => {
    if (!href) return;
    const withLevel = level === "3" ? `${href}&level=3` : href;
    setPickedHref(withLevel);
    setPickerOpen(true);
  };

  const closePicker = () => {
    setPickerOpen(false);
    setPickedHref(null);
  };

  // ✅ THIS is what the reset icon will do (clears progress graph data)
  const resetProgress = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
    setResults([]); // immediately updates UI
  };

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
            <Link href="/" className="flex items-center gap-3 group">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-400/20 ring-1 ring-amber-300/30 transition group-hover:bg-amber-400/25">
                <span className="text-xl">⚡</span>
              </div>

              <div>
                <p className="text-5xl font-extrabold tracking-tight sm:text-6xl"><span className="text-[#FFC400]">Spark</span> Theory</p>
              </div>
            </Link>

            <div className="mt-4">
              <Link
                href="/topics"
                className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"
              >
                ← All trades
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/account"
              className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-[#FF9100]/30 hover:bg-white/15"
            >
              Account
            </Link>
          </div>
        </header>

        {/* Main Progress Chart (top) */}
        <section className="mt-10 mx-auto max-w-4xl">
          <ProgressReport
            key={level}
            results={resultsOldestToNewest ?? []}
            topics={topics ?? []}
            onResetProgress={resetProgress}
          />
        </section>

        {/* Levels */}
        <section className="mt-6">
          <div className="mx-auto grid w-full max-w-2xl grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setLevel("2")}
              className={`rounded-md px-3 py-2 text-left ring-1 transition ${
                level === "2"
                  ? "bg-white/10 ring-[#FFC400]/50 shadow-[0_0_0_1px_rgba(255,196,0,0.28),0_10px_24px_rgba(255,145,0,0.18)]"
                  : "bg-white/5 ring-white/10 hover:bg-white/10 hover:ring-[#FFC400]/40"
              }`}
            >
              <div className="text-[9px] text-white/60">Level 2</div>
              <div className="mt-0.5 text-[13px] font-semibold text-white">
                Level 2 Electrical
              </div>
              <div className="mt-0.5 text-[9px] text-white/60">
                Core foundations and safety principles.
              </div>
            </button>

            <button
              type="button"
              onClick={() => setLevel("3")}
              className={`rounded-md px-3 py-2 text-left ring-1 transition ${
                level === "3"
                  ? "bg-white/10 ring-[#FFC400]/50 shadow-[0_0_0_1px_rgba(255,196,0,0.28),0_10px_24px_rgba(255,145,0,0.18)]"
                  : "bg-white/5 ring-white/10 hover:bg-white/10 hover:ring-[#FFC400]/40"
              }`}
            >
              <div className="text-[9px] text-white/60">Level 3</div>
              <div className="mt-0.5 text-[13px] font-semibold text-white">
                Level 3 Electrical
              </div>
              <div className="mt-0.5 text-[9px] text-white/60">
                Advanced concepts and exam readiness.
              </div>
            </button>
          </div>
        </section>

        {/* Cards */}
        <section className="mt-8 mx-auto max-w-6xl">
          <div
            className={`grid grid-cols-1 items-stretch gap-6 transition-all duration-200 md:grid-cols-2 xl:grid-cols-3 ${
              isSwitchingLevel ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
            }`}
          >
            {visibleCategories.map((c) => (
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
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-md ring-1 transition ${
                          ( (level === "2" && LOCKED_LEVEL2_TOPICS.has(getTopicFromHref(c.href))) || (level === "3" && LOCKED_LEVEL3_TOPICS.has(getTopicFromHref(c.href))) ) && !userLoggedIn
                            ? "text-white/30 ring-white/5 cursor-not-allowed"
                            : "text-white/70 ring-white/10 hover:text-white hover:ring-white/20"
                        }`}
                        onClick={(e) => {
                          const topic = getTopicFromHref(c.href);
                          const isLocked = ((level === "2" && LOCKED_LEVEL2_TOPICS.has(topic)) || (level === "3" && LOCKED_LEVEL3_TOPICS.has(topic))) && !userLoggedIn;
                          if (isLocked) {
                            e.preventDefault();
                            window.location.href = "/login";
                            return;
                          }
                          if (typeof window !== "undefined") {
                            sessionStorage.setItem(
                              SCROLL_RESTORE_KEY,
                              String(window.scrollY)
                            );
                          }
                        }}
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
                    ) : null}
                    <span className="rounded-full bg-[#FFC400]/20 px-3 py-1 text-xs font-semibold text-[#FFC400] ring-1 ring-[#FF9100]/30">
                      {c.tag}
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-sm leading-5 text-white/70">{c.description}</p>

                <button
                  type="button"
                  onClick={() => {
                    const topic = getTopicFromHref(c.href);
                    const isLocked = ((level === "2" && LOCKED_LEVEL2_TOPICS.has(topic)) || (level === "3" && LOCKED_LEVEL3_TOPICS.has(topic))) && !userLoggedIn;
                    if (isLocked) {
                      window.location.href = "/login";
                      return;
                    }
                    openPicker(c.href);
                  }}
                  className={`mt-auto block w-full rounded-xl px-4 py-3 text-center text-sm font-semibold shadow-sm transition ${
                    ( (level === "2" && LOCKED_LEVEL2_TOPICS.has(getTopicFromHref(c.href))) || (level === "3" && LOCKED_LEVEL3_TOPICS.has(getTopicFromHref(c.href))) ) && !userLoggedIn
                      ? "bg-white/10 text-white/70 ring-1 ring-white/10 hover:bg-white/15"
                      : "bg-[#FFC400] text-black shadow-[#FF9100]/20 hover:bg-[#FF9100]"
                  }`}
                >
                  {( (level === "2" && LOCKED_LEVEL2_TOPICS.has(getTopicFromHref(c.href))) || (level === "3" && LOCKED_LEVEL3_TOPICS.has(getTopicFromHref(c.href))) ) && !userLoggedIn
                    ? "Log in to start"
                    : "Start Quiz"}
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
            className="w-full max-w-md rounded-2xl bg-[#1F1F1F] p-6 ring-1 ring-[#FF9100]/20"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold">Choose quiz size</h3>
            <p className="mt-1 text-sm text-white/60">How many questions do you want?</p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {sizes.map((n) => (
                <Link
                  key={n}
                  href={`${pickedHref}&n=${n}${unseenOnly ? "&unseen=1" : ""}${problemOnly ? "&problems=1" : ""}`}
                  className="rounded-xl bg-white/10 px-4 py-3 text-center text-sm font-semibold ring-1 ring-white/15 hover:bg-white/15"
                  onClick={closePicker}
                >
                  {n} questions
                </Link>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-2 text-sm text-white/70">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={unseenOnly}
                  onChange={(e) => setUnseenOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-white/30 bg-white/10 text-[#FF9100]"
                />
                Unseen questions only
              </label>
            </div>

            <div className="mt-4">
              <Link
                href={`${pickedHref}&problems=1`}
                className="block w-full rounded-xl bg-[#FFC400] px-4 py-3 text-center text-sm font-semibold text-black ring-1 ring-[#FF9100]/40 hover:bg-[#FF9100]"
                onClick={closePicker}
              >
                My problem questions
              </Link>
            </div>
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
