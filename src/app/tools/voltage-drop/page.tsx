"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ToolboxAccessGate from "@/components/tools/ToolboxAccessGate";

type PhaseType = "single" | "three";
type CircuitType = "lighting" | "other";

const CABLE_SIZES = ["1.0", "1.5", "2.5", "4", "6", "10", "16"] as const;

const MV_PER_AMP_PER_M: Record<(typeof CABLE_SIZES)[number], number> = {
  "1.0": 44,
  "1.5": 29,
  "2.5": 18,
  "4": 11,
  "6": 7.3,
  "10": 4.4,
  "16": 2.8,
};

export default function VoltageDropPage() {
  const [cableSize, setCableSize] = useState<(typeof CABLE_SIZES)[number]>("2.5");
  const [current, setCurrent] = useState<string>("20");
  const [length, setLength] = useState<string>("25");
  const [phaseType, setPhaseType] = useState<PhaseType>("single");
  const [circuitType, setCircuitType] = useState<CircuitType>("other");

  const result = useMemo(() => {
    const currentValue = Number(current);
    const lengthValue = Number(length);
    const mv = MV_PER_AMP_PER_M[cableSize];

    if (!Number.isFinite(currentValue) || !Number.isFinite(lengthValue) || currentValue < 0 || lengthValue < 0) {
      return null;
    }

    const phaseMultiplier = phaseType === "three" ? Math.sqrt(3) : 1;
    const voltageDrop = (mv * lengthValue * currentValue * phaseMultiplier) / 1000;
    const baseVoltage = phaseType === "three" ? 400 : 230;
    const dropPercent = baseVoltage > 0 ? (voltageDrop / baseVoltage) * 100 : 0;
    const limitPercent = circuitType === "lighting" ? 3 : 5;
    const withinLimits = dropPercent <= limitPercent;

    return {
      voltageDrop,
      dropPercent,
      limitPercent,
      withinLimits,
    };
  }, [cableSize, current, length, phaseType, circuitType]);

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
        <Link
          href="/tools"
          className="inline-flex rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/10"
        >
          Back
        </Link>

        <h1 className="mt-4 text-3xl font-bold tracking-tight">Voltage Drop Calculator</h1>

        <section className="mt-6 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-white/80">
              Cable size (mm²)
              <select
                value={cableSize}
                onChange={(e) => setCableSize(e.target.value as (typeof CABLE_SIZES)[number])}
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white outline-none ring-0 transition focus:border-[#FFC400]/60"
              >
                {CABLE_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium text-white/80">
              Current (amps)
              <input
                type="number"
                min="0"
                step="0.1"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white outline-none ring-0 transition focus:border-[#FFC400]/60"
              />
            </label>

            <label className="text-sm font-medium text-white/80">
              Length (meters)
              <input
                type="number"
                min="0"
                step="0.1"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white outline-none ring-0 transition focus:border-[#FFC400]/60"
              />
            </label>

            <label className="text-sm font-medium text-white/80">
              Phase type
              <select
                value={phaseType}
                onChange={(e) => setPhaseType(e.target.value as PhaseType)}
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white outline-none ring-0 transition focus:border-[#FFC400]/60"
              >
                <option value="single">Single phase</option>
                <option value="three">Three phase</option>
              </select>
            </label>

            <label className="text-sm font-medium text-white/80 sm:col-span-2">
              Circuit type
              <select
                value={circuitType}
                onChange={(e) => setCircuitType(e.target.value as CircuitType)}
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white outline-none ring-0 transition focus:border-[#FFC400]/60"
              >
                <option value="lighting">Lighting circuit (3% limit)</option>
                <option value="other">Other circuit (5% limit)</option>
              </select>
            </label>
          </div>
        </section>

        <section className="mt-6 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
          <h2 className="text-lg font-semibold">Result</h2>

          {!result ? (
            <p className="mt-3 text-sm text-white/70">Enter valid values to calculate voltage drop.</p>
          ) : (
            <div className="mt-4 space-y-2 text-sm text-white/85">
              <p>
                Voltage drop: <span className="font-semibold text-white">{result.voltageDrop.toFixed(2)} V</span>
              </p>
              <p>
                Voltage drop percentage: <span className="font-semibold text-white">{result.dropPercent.toFixed(2)}%</span>
              </p>
              <p>
                Limit: <span className="font-semibold text-white">{result.limitPercent}%</span>
              </p>
              <p
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                  result.withinLimits
                    ? "bg-emerald-400/10 text-emerald-300 ring-emerald-300/30"
                    : "bg-amber-400/10 text-amber-300 ring-amber-300/30"
                }`}
              >
                {result.withinLimits ? "✓ Within limits" : "⚠ Exceeds limit"}
              </p>
            </div>
          )}
        </section>
      </div>
      </main>
    </ToolboxAccessGate>
  );
}
