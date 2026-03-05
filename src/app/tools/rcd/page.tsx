"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ToolboxAccessGate from "@/components/tools/ToolboxAccessGate";

type RcdRating = "30" | "100" | "300";
type TestCurrent = "0.5x" | "1x" | "5x";

export default function RcdPage() {
  const [rating, setRating] = useState<RcdRating>("30");
  const [testCurrent, setTestCurrent] = useState<TestCurrent>("1x");
  const [tripTimeMs, setTripTimeMs] = useState<string>("180");

  const result = useMemo(() => {
    const trip = Number(tripTimeMs);
    if (!Number.isFinite(trip) || trip < 0) return null;

    if (testCurrent === "0.5x") {
      return {
        status: "INFO" as const,
        message: "Expect no trip at 0.5x test current.",
      };
    }

    if (rating === "30") {
      if (testCurrent === "1x") {
        const pass = trip <= 300;
        return {
          status: pass ? ("PASS" as const) : ("FAIL" as const),
          message: `1x test limit is 300 ms (${pass ? "within" : "over"} limit).`,
        };
      }

      const pass = trip <= 40;
      return {
        status: pass ? ("PASS" as const) : ("FAIL" as const),
        message: `5x test limit is 40 ms (${pass ? "within" : "over"} limit).`,
      };
    }

    return {
      status: "INFO" as const,
      message: "MVP rule set currently enforces 30 mA limits only.",
    };
  }, [rating, testCurrent, tripTimeMs]);

  const statusClass =
    result?.status === "PASS"
      ? "bg-emerald-400/10 text-emerald-300 ring-emerald-300/30"
      : result?.status === "FAIL"
      ? "bg-amber-400/10 text-amber-300 ring-amber-300/30"
      : "bg-white/10 text-white/80 ring-white/20";

  return (
    <ToolboxAccessGate>
      <main className="min-h-screen bg-[#1F1F1F] text-white page-transition">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#FFC400]/25 via-[#FF9100]/20 to-[#FFC400]/20 blur-3xl" />
        <div className="absolute bottom-[-220px] right-[-200px] h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-[#FFC400]/18 to-[#FF9100]/12 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_30%_20%,rgba(255,196,0,0.14),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(700px_420px_at_70%_80%,rgba(255,145,0,0.12),transparent_60%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-4xl px-6 py-10">
        <Link href="/tools" className="inline-flex rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/10">
          Back
        </Link>

        <h1 className="mt-4 text-3xl font-bold tracking-tight">RCD Checker</h1>

        <section className="mt-6 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-white/80">
              RCD rating (mA)
              <select value={rating} onChange={(e) => setRating(e.target.value as RcdRating)} className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white outline-none transition focus:border-[#FFC400]/60">
                <option value="30">30</option>
                <option value="100">100</option>
                <option value="300">300</option>
              </select>
            </label>

            <label className="text-sm font-medium text-white/80">
              Test current
              <select value={testCurrent} onChange={(e) => setTestCurrent(e.target.value as TestCurrent)} className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white outline-none transition focus:border-[#FFC400]/60">
                <option value="0.5x">0.5x</option>
                <option value="1x">1x</option>
                <option value="5x">5x</option>
              </select>
            </label>

            <label className="text-sm font-medium text-white/80 sm:col-span-2">
              Measured trip time (ms)
              <input type="number" min="0" step="1" value={tripTimeMs} onChange={(e) => setTripTimeMs(e.target.value)} className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white outline-none transition focus:border-[#FFC400]/60" />
            </label>
          </div>
        </section>

        <section className="mt-6 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
          <h2 className="text-lg font-semibold">Result</h2>
          {!result ? (
            <p className="mt-3 text-sm text-white/70">Enter valid inputs to calculate.</p>
          ) : (
            <div className="mt-4 space-y-2 text-sm text-white/85">
              <p>Measured trip time: <span className="font-semibold text-white">{Number(tripTimeMs).toFixed(0)} ms</span></p>
              <p className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusClass}`}>{result.status}</p>
              <p>{result.message}</p>
            </div>
          )}
        </section>

        <p className="mt-4 text-xs text-white/55">For certification decisions, use calibrated test instruments and current standard requirements.</p>
      </div>
      </main>
    </ToolboxAccessGate>
  );
}
