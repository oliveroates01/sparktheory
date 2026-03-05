"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ToolboxAccessGate from "@/components/tools/ToolboxAccessGate";

type DeviceType = "none" | "B" | "C" | "D";
type DeviceRating = "6" | "10" | "16" | "20" | "32" | "40" | "50" | "63";

const RATINGS: DeviceRating[] = ["6", "10", "16", "20", "32", "40", "50", "63"];

const MAX_ZS: Record<Exclude<DeviceType, "none">, Record<DeviceRating, number>> = {
  B: { "6": 7.67, "10": 4.6, "16": 2.87, "20": 2.3, "32": 1.44, "40": 1.15, "50": 0.92, "63": 0.73 },
  C: { "6": 3.83, "10": 2.3, "16": 1.44, "20": 1.15, "32": 0.72, "40": 0.58, "50": 0.46, "63": 0.37 },
  D: { "6": 1.92, "10": 1.15, "16": 0.72, "20": 0.58, "32": 0.36, "40": 0.29, "50": 0.23, "63": 0.18 },
};

export default function ZsPage() {
  const [ze, setZe] = useState<string>("0.35");
  const [r1PlusR2, setR1PlusR2] = useState<string>("0.8");
  const [r1, setR1] = useState<string>("");
  const [r2, setR2] = useState<string>("");
  const [deviceType, setDeviceType] = useState<DeviceType>("none");
  const [deviceRating, setDeviceRating] = useState<DeviceRating>("32");

  const result = useMemo(() => {
    const zeNum = Number(ze);
    const combinedNum = Number(r1PlusR2);
    const r1Num = Number(r1);
    const r2Num = Number(r2);

    const hasCombined = Number.isFinite(combinedNum) && r1PlusR2.trim() !== "";
    const hasSplit = Number.isFinite(r1Num) && Number.isFinite(r2Num) && r1.trim() !== "" && r2.trim() !== "";

    if (!Number.isFinite(zeNum) || zeNum < 0) return null;
    if (!hasCombined && !hasSplit) return null;

    const rSum = hasCombined ? combinedNum : r1Num + r2Num;
    if (!Number.isFinite(rSum) || rSum < 0) return null;

    const zs = zeNum + rSum;

    if (deviceType === "none") {
      return { zs, rSum, maxZs: null as number | null, pass: null as boolean | null };
    }

    const maxZs = MAX_ZS[deviceType][deviceRating];
    return { zs, rSum, maxZs, pass: zs <= maxZs };
  }, [ze, r1PlusR2, r1, r2, deviceType, deviceRating]);

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

        <h1 className="mt-4 text-3xl font-bold tracking-tight">Earth Fault Loop (Zs) Calculator</h1>

        <section className="mt-6 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-white/80">
              Ze (Ω)
              <input type="number" min="0" step="0.01" value={ze} onChange={(e) => setZe(e.target.value)} className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white outline-none transition focus:border-[#FFC400]/60" />
            </label>

            <label className="text-sm font-medium text-white/80">
              R1+R2 (Ω)
              <input type="number" min="0" step="0.01" value={r1PlusR2} onChange={(e) => setR1PlusR2(e.target.value)} className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white outline-none transition focus:border-[#FFC400]/60" />
            </label>

            <label className="text-sm font-medium text-white/80">
              R1 (Ω)
              <input type="number" min="0" step="0.01" value={r1} onChange={(e) => setR1(e.target.value)} className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white outline-none transition focus:border-[#FFC400]/60" />
            </label>

            <label className="text-sm font-medium text-white/80">
              R2 (Ω)
              <input type="number" min="0" step="0.01" value={r2} onChange={(e) => setR2(e.target.value)} className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white outline-none transition focus:border-[#FFC400]/60" />
            </label>

            <label className="text-sm font-medium text-white/80">
              Device
              <select value={deviceType} onChange={(e) => setDeviceType(e.target.value as DeviceType)} className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white outline-none transition focus:border-[#FFC400]/60">
                <option value="none">None selected</option>
                <option value="B">MCB Type B</option>
                <option value="C">MCB Type C</option>
                <option value="D">MCB Type D</option>
              </select>
            </label>

            <label className="text-sm font-medium text-white/80">
              Rating (A)
              <select value={deviceRating} onChange={(e) => setDeviceRating(e.target.value as DeviceRating)} disabled={deviceType === "none"} className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white outline-none transition focus:border-[#FFC400]/60 disabled:cursor-not-allowed disabled:opacity-60">
                {RATINGS.map((rating) => (
                  <option key={rating} value={rating}>{rating}</option>
                ))}
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
              <p>R1+R2 used: <span className="font-semibold text-white">{result.rSum.toFixed(2)} Ω</span></p>
              <p>Zs: <span className="font-semibold text-white">{result.zs.toFixed(2)} Ω</span></p>
              {result.maxZs === null ? (
                <p className="inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 bg-white/10 text-white/80 ring-white/20">INFO: Select a device for compliance check</p>
              ) : (
                <>
                  <p>Max Zs: <span className="font-semibold text-white">{result.maxZs.toFixed(2)} Ω</span></p>
                  <p className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${result.pass ? "bg-emerald-400/10 text-emerald-300 ring-emerald-300/30" : "bg-amber-400/10 text-amber-300 ring-amber-300/30"}`}>{result.pass ? "PASS" : "FAIL"}</p>
                </>
              )}
            </div>
          )}
        </section>

        <p className="mt-4 text-xs text-white/55">Simplified guidance only. Confirm max Zs values against current BS 7671 data.</p>
      </div>
      </main>
    </ToolboxAccessGate>
  );
}
