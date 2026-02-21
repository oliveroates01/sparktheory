"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ProgressReport, { type StoredResult } from "@/components/ProgressReport";
import SparkTheoryLogo from "@/components/Brand/SparkTheoryLogo";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth } from "@/lib/firebase";
import { db } from "@/lib/firebase";
import { healthSafetyQuestions } from "@/data/healthSafety";
import { principlesElectricalScienceQuestions } from "@/data/principlesElectricalScience";
import { electricalInstallationTechnologyQuestions } from "@/data/ElectricalInstallationTechnology";
import { installationWiringQuestions } from "@/data/installationWiring";
import { communicationWithinBSEQuestions } from "@/data/communicationWithinBSE";
import { principlesElectricalScienceLevel3Questions } from "@/data/principlesElectricalScienceLevel3";
import { electricalTechnologyLevel3Questions } from "@/data/electricalTechnologyLevel3";
import { inspectionTestingCommissioningLevel3Questions } from "@/data/inspectionTestingCommissioningLevel3";
import {
  type ElectricalCategory,
  ELECTRICAL_LEVEL2_CATEGORIES,
  ELECTRICAL_LEVEL3_CATEGORIES,
} from "@/data/electricalTopicCategories";
import { normalizeManualOverride, resolvePlusAccess } from "@/lib/entitlements";

type Category = ElectricalCategory;

const LOCKED_LEVEL2_TOPICS = new Set([
  "all-level-2",
  "electrical-installation-technology",
  "installation-wiring-systems-enclosures",
  "communication-within-building-services-engineering",
]);
const LOCKED_LEVEL3_TOPICS = new Set([
  "all-level-3",
  "electrical-technology",
  "inspection-testing-commissioning",
]);


const STORAGE_KEY_LEVEL2 = "qm_results_v1";
const STORAGE_KEY_LEVEL3 = "qm_results_v1_level3";
const SCROLL_RESTORE_KEY = "qm_scroll_trade_electrical";
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

function storageKeyForLevel(level: "2" | "3") {
  return level === "3" ? STORAGE_KEY_LEVEL3 : STORAGE_KEY_LEVEL2;
}

function scopedProgressKey(baseKey: string, userId?: string | null) {
  return userId ? `${baseKey}__uid_${userId}` : baseKey;
}

function storageKeyForLevelAndUser(level: "2" | "3", userId?: string | null) {
  return scopedProgressKey(storageKeyForLevel(level), userId);
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

function requiresPlusTopic(level: "2" | "3", topic: string) {
  return level === "2"
    ? LOCKED_LEVEL2_TOPICS.has(topic)
    : LOCKED_LEVEL3_TOPICS.has(topic);
}

type TopicAccessState = "loading" | "locked" | "unlocked";

function getTopicAccessState(
  requiresPlus: boolean,
  authReady: boolean,
  userLoggedIn: boolean,
  subscriptionReady: boolean,
  hasPlusAccess: boolean
): TopicAccessState {
  if (!requiresPlus) return "unlocked";
  if (!authReady) return "loading";
  if (!userLoggedIn) return "locked";
  if (!subscriptionReady) return "loading";
  return hasPlusAccess ? "unlocked" : "locked";
}

function seenKeyForTopic(level: "2" | "3", topic: string, userId?: string | null) {
  const safeTopic = topic || "unknown";
  return scopedProgressKey(`qm_seen_${level}_${safeTopic}`, userId);
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

function questionBankFor(topic: string, level: "2" | "3"): unknown[] {
  if (level === "3") {
    if (topic === "principles-electrical-science") {
      return principlesElectricalScienceLevel3Questions as unknown[];
    }
    if (topic === "electrical-technology") {
      return electricalTechnologyLevel3Questions as unknown[];
    }
    if (topic === "inspection-testing-commissioning") {
      return inspectionTestingCommissioningLevel3Questions as unknown[];
    }
    return [];
  }

  if (topic === "principles-electrical-science") {
    return principlesElectricalScienceQuestions as unknown[];
  }
  if (topic === "all-level-2") {
    return (
      [
        ...(healthSafetyQuestions as unknown[]),
        ...(principlesElectricalScienceQuestions as unknown[]),
        ...(electricalInstallationTechnologyQuestions as unknown[]),
        ...(installationWiringQuestions as unknown[]),
        ...(communicationWithinBSEQuestions as unknown[]),
      ]
    );
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

function totalQuestionsFor(topic: string, level: "2" | "3") {
  return questionBankFor(topic, level).length;
}

function seenCountForTopic(topic: string, level: "2" | "3", seen: Set<string>) {
  const bank = questionBankFor(topic, level);
  if (bank.length === 0) return 0;

  let count = 0;
  for (const raw of bank) {
    if (!raw || typeof raw !== "object") continue;
    const rec = raw as Record<string, unknown>;
    const id = typeof rec.id === "string" ? rec.id : "";
    const legacy = Array.isArray(rec.legacyIds)
      ? rec.legacyIds.filter((x): x is string => typeof x === "string")
      : [];
    const ids = id ? [id, ...legacy] : legacy;
    if (ids.some((qid) => seen.has(qid))) count += 1;
  }
  return count;
}

const CATEGORIES: Category[] = ELECTRICAL_LEVEL2_CATEGORIES;
const LEVEL3_CATEGORIES: Category[] = ELECTRICAL_LEVEL3_CATEGORIES;

export default function ElectricalPage() {
  const [level, setLevel] = useState<"2" | "3">("2");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const storageKey = storageKeyForLevelAndUser(level, currentUserId);
  const [results, setResults] = useState<StoredResult[]>([]);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [hasPlusAccess, setHasPlusAccess] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [subscriptionReady, setSubscriptionReady] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickedHref, setPickedHref] = useState<string | null>(null);
  const [selectedQuizSize, setSelectedQuizSize] = useState<number | null>(null);
  const [progressOpen, setProgressOpen] = useState(false);
  const [unseenOnly, setUnseenOnly] = useState(false);
  const [isSwitchingLevel, setIsSwitchingLevel] = useState(false);
  const [unseenCount, setUnseenCount] = useState<number | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  const sizes = [5, 15, 30, 50];

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
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
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
        if (cached === "1") {
          setHasPlusAccess(true);
        }
      } catch {
        // ignore cache failures
      }
      setSubscriptionReady(false);
      void loadSubscription(user);
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
  const displayCategories = useMemo<(Category | null)[]>(() => {
    const targetCount = Math.max(CATEGORIES.length, LEVEL3_CATEGORIES.length);
    const fillers = Array.from(
      { length: Math.max(0, targetCount - visibleCategories.length) },
      () => null
    );
    return [...visibleCategories, ...fillers];
  }, [visibleCategories]);

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
    const seenKey = seenKeyForTopic(lvl, topic, currentUserId);
    const seen = loadSeenIds(seenKey);
    const seenCount = seenCountForTopic(topic, lvl, seen);
    const unseen = Math.max(total - seenCount, 0);
    setUnseenCount(unseen);
  }, [pickerOpen, pickedHref, level, currentUserId]);

  const openPicker = (href?: string) => {
    if (!href) return;
    const withLevel = level === "3" ? `${href}&level=3` : href;
    setPickedHref(withLevel);
    setSelectedQuizSize(null);
    setPickerOpen(true);
  };

  const closePicker = () => {
    setPickerOpen(false);
    setPickedHref(null);
    setSelectedQuizSize(null);
  };

  const startSelectedQuiz = () => {
    if (!pickedHref || !selectedQuizSize) return;
    const href = `${pickedHref}&n=${selectedQuizSize}${unseenOnly ? "&unseen=1" : ""}`;
    closePicker();
    router.push(href);
  };

  const openProgress = () => setProgressOpen(true);
  const closeProgress = () => setProgressOpen(false);

  useEffect(() => {
    setPickerOpen(false);
    setPickedHref(null);
    setSelectedQuizSize(null);
    setProgressOpen(false);
  }, [pathname]);

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
            <Link href="/topics" className="group inline-block">
              <SparkTheoryLogo className="transition group-hover:opacity-95" />
            </Link>

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

        {/* Levels */}
        <section className="mt-10">
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
          <div className="mx-auto mt-3 w-full max-w-2xl">
            <button
              type="button"
              onClick={openProgress}
              className="block w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-center text-xs font-semibold text-white/80 transition hover:bg-white/10"
            >
              Show progress
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
            {displayCategories.map((c, index) => {
              if (!c) {
                return (
                  <div
                    key={`filler-${index}`}
                    aria-hidden="true"
                    className="invisible flex min-h-[260px] rounded-2xl p-6"
                  />
                );
              }
              const shouldSpanFull =
                displayCategories.length % 3 === 1 &&
                index === displayCategories.length - 1;
              const topic = getTopicFromHref(c.href);
              const requiresPlus = requiresPlusTopic(level, topic);
              const accessState = getTopicAccessState(
                requiresPlus,
                authReady,
                userLoggedIn,
                subscriptionReady,
                hasPlusAccess
              );
              const isLocked = accessState === "locked";
              const isCheckingAccess = accessState === "loading";
              return (
              <div
                key={c.id}
                className={`flex h-full flex-col rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 transition hover:bg-white/10 hover:ring-white/15 ${
                  shouldSpanFull ? "xl:col-span-3" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-bold leading-snug">{c.title}</h3>

                  <div className="shrink-0">
                    {c.id !== "all-level-2" && c.id !== "all-level-3" ? (
                      c.topicHref ? (
                      <Link
                        href={c.topicHref}
                        aria-label={`Open ${c.title} topic`}
                        className="inline-flex items-center gap-2 rounded-full bg-[#FFC400]/20 px-3 py-1 text-xs font-semibold text-[#FFC400] ring-1 ring-[#FF9100]/30 transition hover:bg-[#FFC400]/25"
                        onClick={(e) => {
                          if (isCheckingAccess) {
                            e.preventDefault();
                            return;
                          }
                          if (isLocked) {
                            e.preventDefault();
                            window.location.href = userLoggedIn ? "/account" : "/login";
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
                          className="h-3.5 w-3.5"
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
                        {c.tag}
                      </Link>
                      ) : (
                      <span className="inline-flex items-center gap-2 rounded-full bg-[#FFC400]/20 px-3 py-1 text-xs font-semibold text-[#FFC400] ring-1 ring-[#FF9100]/30">
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          className="h-3.5 w-3.5"
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
                        {c.tag}
                      </span>
                      )
                    ) : null}
                  </div>
                </div>

                <p className="mt-3 text-sm leading-5 text-white/70">{c.description}</p>

                <button
                  type="button"
                  onClick={() => {
                    if (isCheckingAccess) return;
                    if (isLocked) {
                      window.location.href = userLoggedIn ? "/account" : "/login";
                      return;
                    }
                    openPicker(c.href);
                  }}
                  className={`mt-auto block w-full rounded-xl px-4 py-3 text-center text-sm font-semibold shadow-sm transition ${
                    isLocked || isCheckingAccess
                      ? "bg-white/10 text-white/70 ring-1 ring-white/10 hover:bg-white/15"
                      : "bg-[#FFC400] text-black shadow-[#FF9100]/20 hover:bg-[#FF9100]"
                  }`}
                  disabled={isCheckingAccess}
                >
                  {isCheckingAccess ? "Checking access..." : isLocked ? "Spark Theory +" : "Start Quiz"}
                </button>
              </div>
              );
            })}
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
                <button
                  key={n}
                  type="button"
                  onClick={() => setSelectedQuizSize(n)}
                  className={`rounded-xl px-4 py-3 text-center text-sm font-semibold ring-1 transition ${
                    selectedQuizSize === n
                      ? "bg-[#FFC400]/15 text-[#FFC400] ring-[#FFC400]/70"
                      : "bg-white/10 text-white ring-white/15 hover:bg-white/15"
                  }`}
                >
                  {n} questions
                </button>
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
              <button
                type="button"
                onClick={startSelectedQuiz}
                disabled={!selectedQuizSize}
                className="mb-3 block w-full rounded-xl bg-[#FFC400] px-4 py-3 text-center text-sm font-semibold text-black ring-1 ring-[#FF9100]/40 hover:bg-[#FF9100] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/60 disabled:ring-white/15"
              >
                Start quiz
              </button>
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

      {/* Progress modal */}
      {progressOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
          onClick={closeProgress}
        >
          <div
            className="w-full max-w-5xl rounded-2xl bg-[#1F1F1F] p-4 ring-1 ring-[#FF9100]/20 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-bold">Progress tracker</h3>
              <button
                type="button"
                onClick={closeProgress}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/75 hover:bg-white/10"
              >
                Close
              </button>
            </div>
            <ProgressReport
              key={`${level}-modal`}
              results={resultsOldestToNewest ?? []}
              topics={topics ?? []}
              onResetProgress={resetProgress}
            />
          </div>
        </div>
      )}
    </main>
  );
}
