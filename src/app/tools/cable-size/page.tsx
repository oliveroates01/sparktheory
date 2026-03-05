"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ToolboxAccessGate from "@/components/tools/ToolboxAccessGate";

type InstallMethod =
  | "clippedDirect"
  | "inConduitOrTrunking"
  | "inWall"
  | "surroundedByInsulation"
  | "buriedUnderground";
type AmbientTemp = "25" | "30" | "35" | "40" | "45" | "50";
type Grouping = "1" | "2" | "3" | "4+";

type CableSize = "1.5" | "2.5" | "4" | "6" | "10" | "16";

const CABLE_SIZES: CableSize[] = ["1.5", "2.5", "4", "6", "10", "16"];

const CAPACITY_TABLE: Record<InstallMethod, Record<CableSize, number>> = {
  clippedDirect: { "1.5": 19.5, "2.5": 27, "4": 36, "6": 46, "10": 63, "16": 85 },
  inConduitOrTrunking: { "1.5": 16.5, "2.5": 23, "4": 30, "6": 38, "10": 52, "16": 69 },
  inWall: { "1.5": 16.5, "2.5": 23, "4": 30, "6": 38, "10": 52, "16": 69 },
  surroundedByInsulation: { "1.5": 13.5, "2.5": 18, "4": 24, "6": 30, "10": 42, "16": 56 },
  buriedUnderground: { "1.5": 21, "2.5": 29, "4": 39, "6": 50, "10": 68, "16": 92 },
};

const TEMP_FACTOR: Record<AmbientTemp, number> = {
  "25": 1.03,
  "30": 1,
  "35": 0.94,
  "40": 0.87,
  "45": 0.79,
  "50": 0.71,
};
const GROUPING_FACTOR: Record<Grouping, number> = { "1": 1, "2": 0.8, "3": 0.7, "4+": 0.65 };

export default function CableSizePage() {
  const [method, setMethod] = useState<InstallMethod>("clippedDirect");
  const [ib, setIb] = useState<string>("20");
  const [ambient, setAmbient] = useState<AmbientTemp>("30");
  const [grouping, setGrouping] = useState<Grouping>("1");

  const result = useMemo(() => {
    const currentIb = Number(ib);
    if (!Number.isFinite(currentIb) || currentIb <= 0) return null;

    const ca = TEMP_FACTOR[ambient];
    const cg = GROUPING_FACTOR[grouping];

    const evaluated = CABLE_SIZES.map((size) => {
      const itable = CAPACITY_TABLE[method][size];
      const izCorrected = itable * ca * cg;
      return { size, itable, izCorrected, pass: izCorrected >= currentIb };
    });

    const selected = evaluated.find((entry) => entry.pass) ?? null;

    return { ib: currentIb, ca, cg, selected, largest: evaluated[evaluated.length - 1] };
  }, [method, ib, ambient, grouping]);

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

        <h1 className="mt-4 text-3xl font-bold tracking-tight">Cable Size Calculator</h1>

        <section className="mt-6 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-white/80">
              Installation method
              <select value={method} onChange={(e) => setMethod(e.target.value as InstallMethod)} className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white outline-none transition focus:border-[#FFC400]/60">
                <option value="clippedDirect">Clipped direct</option>
                <option value="inConduitOrTrunking">In conduit or trunking</option>
                <option value="inWall">In a wall</option>
                <option value="surroundedByInsulation">Surrounded by insulation</option>
                <option value="buriedUnderground">Buried underground</option>
              </select>
            </label>

            <label className="text-sm font-medium text-white/80">
              Design current Ib (A)
              <input type="number" min="0" step="0.1" value={ib} onChange={(e) => setIb(e.target.value)} className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white outline-none transition focus:border-[#FFC400]/60" />
            </label>

            <label className="text-sm font-medium text-white/80">
              Ambient temp (°C)
              <select value={ambient} onChange={(e) => setAmbient(e.target.value as AmbientTemp)} className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white outline-none transition focus:border-[#FFC400]/60">
                <option value="25">25°C</option>
                <option value="30">30°C</option>
                <option value="35">35°C</option>
                <option value="40">40°C</option>
                <option value="45">45°C</option>
                <option value="50">50°C</option>
              </select>
            </label>

            <label className="text-sm font-medium text-white/80">
              Grouping
              <select value={grouping} onChange={(e) => setGrouping(e.target.value as Grouping)} className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white outline-none transition focus:border-[#FFC400]/60">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4+">4+</option>
              </select>
            </label>
          </div>
        </section>

        <section className="mt-6 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
          <h2 className="text-lg font-semibold">Result</h2>
          {!result ? (
            <p className="mt-3 text-sm text-white/70">Enter valid inputs to calculate.</p>
          ) : (
            <div className="mt-4 space-y-2 text-sm text-white/85">
              <p>Required Ib: <span className="font-semibold text-white">{result.ib.toFixed(1)} A</span></p>
              <p>Correction factors: <span className="font-semibold text-white">Ca {result.ca}</span>, <span className="font-semibold text-white">Cg {result.cg}</span></p>
              <p>Recommended size: <span className="font-semibold text-white">{result.selected ? `${result.selected.size} mm²` : "No size in table"}</span></p>
              <p>Iz corrected: <span className="font-semibold text-white">{(result.selected?.izCorrected ?? result.largest.izCorrected).toFixed(1)} A</span></p>
              <p className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${result.selected ? "bg-emerald-400/10 text-emerald-300 ring-emerald-300/30" : "bg-amber-400/10 text-amber-300 ring-amber-300/30"}`}>
                {result.selected ? "PASS" : "FAIL"}
              </p>
            </div>
          )}
        </section>

        <p className="mt-4 text-xs text-white/55">Simplified guidance only. Verify against BS 7671 tables and installation conditions.</p>
      </div>
      </main>
    </ToolboxAccessGate>
  );
}
