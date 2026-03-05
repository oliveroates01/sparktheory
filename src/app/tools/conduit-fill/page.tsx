"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ToolboxAccessGate from "@/components/tools/ToolboxAccessGate";

type ConduitSize = "16" | "20" | "25" | "32" | "40" | "50";
type Mode = "count" | "max";

const INTERNAL_DIAMETER_MM: Record<ConduitSize, number> = {
  "16": 13,
  "20": 16.8,
  "25": 21.2,
  "32": 28.4,
  "40": 36.3,
  "50": 46.3,
};

export default function ConduitFillPage() {
  const [conduitSize, setConduitSize] = useState<ConduitSize>("20");
  const [cableOd, setCableOd] = useState<string>("5");
  const [mode, setMode] = useState<Mode>("count");
  const [cableCount, setCableCount] = useState<string>("3");

  const result = useMemo(() => {
    const od = Number(cableOd);
    if (!Number.isFinite(od) || od <= 0) return null;

    const id = INTERNAL_DIAMETER_MM[conduitSize];
    const conduitArea = Math.PI * (id / 2) * (id / 2);
    const cableArea = Math.PI * (od / 2) * (od / 2);
    const maxAt40 = Math.floor((conduitArea * 0.4) / cableArea);

    if (mode === "max") {
      return { conduitArea, cableArea, fillPercent: 0, maxAt40, ok: true, count: null as number | null };
    }

    const count = Number(cableCount);
    if (!Number.isFinite(count) || count < 0) return null;

    const totalCableArea = cableArea * count;
    const fillPercent = (totalCableArea / conduitArea) * 100;
    const ruleApplies = count >= 3;
    const ok = !ruleApplies || fillPercent <= 40;

    return { conduitArea, cableArea, fillPercent, maxAt40, ok, count };
  }, [conduitSize, cableOd, mode, cableCount]);

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

        <h1 className="mt-4 text-3xl font-bold tracking-tight">Conduit Fill Calculator</h1>

        <section className="mt-6 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-white/80">
              Conduit size (mm)
              <select value={conduitSize} onChange={(e) => setConduitSize(e.target.value as ConduitSize)} className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white outline-none transition focus:border-[#FFC400]/60">
                <option value="16">16</option>
                <option value="20">20</option>
                <option value="25">25</option>
                <option value="32">32</option>
                <option value="40">40</option>
                <option value="50">50</option>
              </select>
            </label>

            <label className="text-sm font-medium text-white/80">
              Cable OD (mm)
              <input type="number" min="0" step="0.1" value={cableOd} onChange={(e) => setCableOd(e.target.value)} className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white outline-none transition focus:border-[#FFC400]/60" />
            </label>

            <label className="text-sm font-medium text-white/80">
              Mode
              <select value={mode} onChange={(e) => setMode(e.target.value as Mode)} className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white outline-none transition focus:border-[#FFC400]/60">
                <option value="count">Number of cables</option>
                <option value="max">Calculate max</option>
              </select>
            </label>

            <label className="text-sm font-medium text-white/80">
              Number of cables
              <input type="number" min="0" step="1" value={cableCount} onChange={(e) => setCableCount(e.target.value)} disabled={mode === "max"} className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white outline-none transition focus:border-[#FFC400]/60 disabled:cursor-not-allowed disabled:opacity-60" />
            </label>
          </div>
        </section>

        <section className="mt-6 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
          <h2 className="text-lg font-semibold">Result</h2>
          {!result ? (
            <p className="mt-3 text-sm text-white/70">Enter valid inputs to calculate.</p>
          ) : mode === "max" ? (
            <div className="mt-4 space-y-2 text-sm text-white/85">
              <p>Conduit area: <span className="font-semibold text-white">{result.conduitArea.toFixed(1)} mm²</span></p>
              <p>Cable area: <span className="font-semibold text-white">{result.cableArea.toFixed(1)} mm²</span></p>
              <p>Max cables (40% fill): <span className="font-semibold text-white">{result.maxAt40}</span></p>
              <p className="inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 bg-emerald-400/10 text-emerald-300 ring-emerald-300/30">OK</p>
            </div>
          ) : (
            <div className="mt-4 space-y-2 text-sm text-white/85">
              <p>Conduit area: <span className="font-semibold text-white">{result.conduitArea.toFixed(1)} mm²</span></p>
              <p>Cable area (each): <span className="font-semibold text-white">{result.cableArea.toFixed(1)} mm²</span></p>
              <p>Fill: <span className="font-semibold text-white">{result.fillPercent.toFixed(1)}%</span></p>
              <p>Max cables (40% fill): <span className="font-semibold text-white">{result.maxAt40}</span></p>
              <p className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${result.ok ? "bg-emerald-400/10 text-emerald-300 ring-emerald-300/30" : "bg-amber-400/10 text-amber-300 ring-amber-300/30"}`}>
                {result.ok ? "OK" : "Too full"}
              </p>
            </div>
          )}
        </section>

        <p className="mt-4 text-xs text-white/55">Uses a 40% fill limit for 3 or more cables. Check actual cable ODs from manufacturer data.</p>
      </div>
      </main>
    </ToolboxAccessGate>
  );
}
