"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import ProgressReport, { type StoredResult } from "@/components/ProgressReport";
import {
  ELECTRICAL_LEVEL2_CATEGORIES,
  ELECTRICAL_LEVEL3_CATEGORIES,
} from "@/data/electricalTopicCategories";
import { auth } from "@/lib/firebase";

function storageKeyForLevel(level: "2" | "3") {
  return level === "3" ? "qm_results_v1_level3" : "qm_results_v1";
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

export default function ElectricalProgressClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [results, setResults] = useState<StoredResult[]>([]);

  const level = searchParams.get("level") === "3" ? "3" : "2";
  const storageKey = useMemo(
    () => storageKeyForLevelAndUser(level, currentUserId),
    [level, currentUserId]
  );

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUserId(user?.uid ?? null);
    });
    return () => unsub();
  }, []);

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

  const resetProgress = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
    setResults([]);
  };

  const resultsOldestToNewest = useMemo(() => {
    return [...results].sort((a, b) => {
      const ta = a.date ? new Date(a.date).getTime() : 0;
      const tb = b.date ? new Date(b.date).getTime() : 0;
      return ta - tb;
    });
  }, [results]);

  const visibleCategories = level === "3" ? ELECTRICAL_LEVEL3_CATEGORIES : ELECTRICAL_LEVEL2_CATEGORIES;
  const topics = useMemo(
    () => visibleCategories.map((c) => getTopicFromHref(c.href)).filter(Boolean),
    [visibleCategories]
  );

  const quizzesTaken = results.length;
  const bestScore =
    quizzesTaken > 0
      ? Math.max(...results.map((item) => Number(item.score) || 0))
      : 0;

  const setLevelParam = (nextLevel: "2" | "3") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("level", nextLevel);
    router.replace(`/trade/electrical/progress?${params.toString()}`, { scroll: false });
  };

  return (
    <main className="min-h-screen bg-[#1F1F1F] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#FFC400]/25 via-[#FF9100]/20 to-[#FFC400]/20 blur-3xl" />
        <div className="absolute bottom-[-220px] right-[-200px] h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-[#FFC400]/18 to-[#FF9100]/12 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_30%_20%,rgba(255,196,0,0.14),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(700px_420px_at_70%_80%,rgba(255,145,0,0.12),transparent_60%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-6 py-6 page-transition">
        <section className="mx-auto w-full max-w-5xl">
          <Link
            href={`/trade/electrical?level=${level}`}
            className="inline-flex rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/10"
          >
            Back
          </Link>

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
              <div className="mt-0.5 text-[13px] font-semibold text-white">
                Level 2 Electrical
              </div>
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
              <div className="mt-0.5 text-[13px] font-semibold text-white">
                Level 3 Electrical
              </div>
            </button>
          </div>

          <div className="mt-6 rounded-2xl bg-[#1F1F1F] p-4 ring-1 ring-[#FF9100]/20 sm:p-6">
            <ProgressReport
              key={`${level}-progress-page`}
              results={resultsOldestToNewest}
              topics={topics}
              headerStats={{ quizzesTaken, bestScore }}
              onResetProgress={resetProgress}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
