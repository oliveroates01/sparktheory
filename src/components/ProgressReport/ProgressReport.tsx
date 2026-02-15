"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

export type StoredResult = {
  label: string;
  score: number; // 0-100
  type?: "practice" | "simulated";
  date?: string; // ISO
  topic?: string;

  // ✅ OPTIONAL (if you add these later from the quiz page, the tooltip will show them)
  correct?: number; // e.g. 17
  total?: number; // e.g. 20
  secondsTaken?: number; // e.g. 361
};

type Props = {
  results: StoredResult[];
  topics: string[];
  lockedTopic?: string;

  /**
   * If provided, a reset icon appears top-right.
   * Clicking it opens a confirm modal, then calls this function.
   */
  onResetProgress?: () => void;
};

type Mode = "all" | string;

const MAX_POINTS = 50;
const CHART_H = 260;
const VISIBLE_POINTS = 6;

const STICKY_AXIS_W = 56;
const SCROLL_TO_END_DELAY_MS = 450;
const SCROLL_ANIM_MS = 900;

const MARGIN = { top: 12, right: 16, bottom: 18, left: 10 };
const Y_TICKS = [0, 20, 40, 60, 80, 100] as const;
const X_AXIS_H = 36;

function safeTime(d?: string) {
  if (!d) return 0;
  const t = new Date(d).getTime();
  return Number.isFinite(t) ? t : 0;
}

function clampScore(n: unknown): number {
  const v = Number(n);
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(100, v));
}

function topicLabel(topic?: string) {
  const t = (topic || "").toLowerCase();
  if (!t) return "";
  if (t === "health-safety") return "Health & Safety";
  if (t === "principles-electrical-science") return "Principles";
  if (t === "electrical-installation-technology") return "Installation Tech";
  if (t === "installation-wiring-systems-enclosures") return "Wiring Systems";
  if (t === "communication-within-building-services-engineering") return "Comms";
  if (t === "electrical-technology") return "Electrical Tech";
  if (t === "inspection-testing-commissioning") return "Inspection & Testing";
  if (t === "all-level-2") return "All Level 2";
  if (t === "all-level-3") return "All Level 3";
  return t.replace(/-/g, " ");
}

function toLabel(r: StoredResult, idx: number) {
  const byTopic = topicLabel(r.topic);
  if (byTopic) return byTopic;
  const raw = (r.label || "").trim();
  return raw ? raw : `T${idx + 1}`;
}

function attemptLabel(r: StoredResult, idx: number) {
  if (!r.date) return `Test ${idx + 1}`;
  const d = new Date(r.date);
  if (Number.isNaN(d.getTime())) return `Test ${idx + 1}`;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}`;
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function formatMMSS(seconds?: number) {
  if (!Number.isFinite(seconds)) return "—";
  const s = Math.max(0, Math.floor(seconds as number));
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

function formatDateDDMMYYYY(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

/**
 * ✅ Pill "stamp" tooltip
 * ✅ NO score / % shown
 * ✅ NO triangle
 */
type StampTooltipPayload = {
  payload?: {
    date?: string;
    correct?: number;
    total?: number;
    secondsTaken?: number;
  };
};

type StampTooltipProps = {
  active?: boolean;
  payload?: StampTooltipPayload[];
};

function StampTooltip({ active, payload }: StampTooltipProps) {
  if (!active || !payload?.length) return null;

  const p = payload[0]?.payload;

  if (!p) return null;

  const totalNum = Number.isFinite(p.total) ? (p.total as number) : null;
  const correctNum = Number.isFinite(p.correct) ? (p.correct as number) : null;
  const hasAnswers = totalNum !== null && totalNum > 0;
  const answers =
    hasAnswers && correctNum !== null
      ? `${correctNum}/${totalNum}`
      : hasAnswers
      ? `0/${totalNum}`
      : "—";

  const timeTaken = Number.isFinite(p.secondsTaken)
    ? formatMMSS(p.secondsTaken)
    : "00:00";

  return (
    <div
      className="
        rounded-full bg-white/95 px-4 py-2
        text-[13px] text-slate-700
        shadow-xl ring-1 ring-black/10
        backdrop-blur
      "
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Answers:</span>
          <span className="font-semibold">{answers}</span>
        </div>

        <div className="h-4 w-px bg-slate-200/80" />

        <div className="flex items-center gap-2">
          <span className="text-slate-500">Time:</span>
          <span className="font-semibold">{timeTaken}</span>
        </div>

        <div className="h-4 w-px bg-slate-200/80" />

        <div className="flex items-center gap-2">
          <span className="text-slate-500">Date:</span>
          <span className="font-semibold">{formatDateDDMMYYYY(p.date)}</span>
        </div>
      </div>
    </div>
  );
}

function ResetIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 1 1-2.64-6.36" />
      <path d="M21 3v6h-6" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

export default function ProgressReport({
  results,
  topics,
  lockedTopic,
  onResetProgress,
}: Props) {
  const [mode, setMode] = useState<Mode>(lockedTopic ? lockedTopic : "all");
  const effectiveMode = lockedTopic ? lockedTopic : mode;

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const prevModeRef = useRef<Mode>(effectiveMode);
  const scrollTimerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const [plotViewportW, setPlotViewportW] = useState(720);

  // reset confirm modal
  const [resetOpen, setResetOpen] = useState(false);

  // ✅ info modal (Help)
  const [infoOpen, setInfoOpen] = useState(false);

  // measure viewport width (responsive)
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const update = () => {
      const w = el.clientWidth;
      setPlotViewportW(Math.max(520, w));
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  const filteredOldestToNewest = useMemo(() => {
    const base = Array.isArray(results) ? [...results] : [];

    const byTopic =
      effectiveMode === "all"
        ? base
        : base.filter(
            (r) => (r.topic || "").toLowerCase() === effectiveMode
          );

    byTopic.sort((a, b) => safeTime(a.date) - safeTime(b.date));
    return byTopic.slice(Math.max(0, byTopic.length - MAX_POINTS));
  }, [results, effectiveMode]);

  const chartData = useMemo(() => {
    let total = 0;

    return filteredOldestToNewest.map((r, idx) => {
      const score = clampScore(r.score);
      total += score;

      const runningAvg = total / (idx + 1);

      return {
        label: toLabel(r, idx),
        attempt: attemptLabel(r, idx),
        avg: Math.round(runningAvg),
        score,
        topic: (r.topic || "").toLowerCase(),
        date: r.date,
        correct: r.correct,
        total: r.total,
        secondsTaken: r.secondsTaken,
      };
    });
  }, [filteredOldestToNewest]);

  const testAverage = useMemo(() => {
    if (!filteredOldestToNewest.length) return 0;
    const sum = filteredOldestToNewest.reduce(
      (s, r) => s + clampScore(r.score),
      0
    );
    return Math.round(sum / filteredOldestToNewest.length);
  }, [filteredOldestToNewest]);

  const lastChange = useMemo(() => {
    if (chartData.length < 2) return null;
    const prev = Number(chartData[chartData.length - 2]?.avg) || 0;
    const last = Number(chartData[chartData.length - 1]?.avg) || 0;
    return Math.round((last - prev) * 10) / 10;
  }, [chartData]);

  const attemptsShown = filteredOldestToNewest.length;
  const noData = chartData.length === 0;
  const modeDisplayLabel =
    effectiveMode === "all" ? "All topics" : topicLabel(effectiveMode);

  const pxPerPoint = Math.max(60, Math.floor(plotViewportW / VISIBLE_POINTS));
  const svgWidth = Math.max(chartData.length * pxPerPoint, plotViewportW);

  // force grid lines at exact tick positions
  const horizontalPoints = useMemo(() => {
    const innerH = CHART_H - MARGIN.top - MARGIN.bottom;
    return Y_TICKS.map((v) => MARGIN.top + (1 - v / 100) * innerH);
  }, []);

  const animateScrollTo = (
    el: HTMLDivElement,
    targetLeft: number,
    durationMs: number
  ) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const startLeft = el.scrollLeft;
    const delta = targetLeft - startLeft;

    if (Math.abs(delta) < 1) {
      el.scrollLeft = targetLeft;
      return;
    }

    const startTime = performance.now();

    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / durationMs);
      const eased = easeInOutCubic(t);
      el.scrollLeft = startLeft + delta * eased;

      if (t < 1) rafRef.current = requestAnimationFrame(step);
      else el.scrollLeft = targetLeft;
    };

    rafRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    if (scrollTimerRef.current) {
      window.clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = null;
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    const modeChanged = prevModeRef.current !== effectiveMode;
    prevModeRef.current = effectiveMode;

    const getMaxForCurrentChart = () => Math.max(0, svgWidth - el.clientWidth);

    if (modeChanged) {
      el.scrollLeft = 0;

      scrollTimerRef.current = window.setTimeout(() => {
        requestAnimationFrame(() => {
          animateScrollTo(el, getMaxForCurrentChart(), SCROLL_ANIM_MS);
        });
      }, SCROLL_TO_END_DELAY_MS);
    } else {
      requestAnimationFrame(() => {
        animateScrollTo(el, getMaxForCurrentChart(), 600);
      });
    }

    return () => {
      if (scrollTimerRef.current) {
        window.clearTimeout(scrollTimerRef.current);
        scrollTimerRef.current = null;
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [effectiveMode, attemptsShown, pxPerPoint, svgWidth]);

  const canReset = Boolean(onResetProgress) && !lockedTopic;

  const openReset = () => setResetOpen(true);
  const closeReset = () => setResetOpen(false);

  const openInfo = () => setInfoOpen(true);
  const closeInfo = () => setInfoOpen(false);

  const confirmReset = () => {
    closeReset();
    onResetProgress?.();
    setMode("all");
  };

  return (
    <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Progress reports</h2>

          <p className="mt-1 text-sm text-white/60">
            Test average –{" "}
            <span className="text-white font-semibold">{testAverage}%</span>
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/40">
            <span>
              {attemptsShown === 0
                ? "No results yet"
                : `Showing ${attemptsShown} • ${
                    modeDisplayLabel
                  }`}
            </span>
            {lastChange !== null && (
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] ring-1 ${
                  lastChange > 0
                    ? "bg-emerald-500/15 text-emerald-200 ring-emerald-400/30"
                    : lastChange < 0
                    ? "bg-rose-500/15 text-rose-200 ring-rose-400/30"
                    : "bg-white/10 text-white/70 ring-white/15"
                }`}
              >
                {lastChange > 0
                  ? `↑ ${lastChange}% since last test`
                  : lastChange < 0
                  ? `↓ ${Math.abs(lastChange)}% since last test`
                  : "→ 0% since last test"}
              </span>
            )}
          </div>
        </div>

        {/* Top-right buttons */}
        {!lockedTopic && (
          <div className="flex items-center gap-2">
            {/* ✅ Info button */}
            <button
              type="button"
              onClick={openInfo}
              className="inline-flex items-center justify-center rounded-full bg-white/10 p-2 text-white/80 ring-1 ring-white/10 hover:bg-white/15"
              title="Help"
              aria-label="Help"
            >
              <InfoIcon />
            </button>

            {/* ✅ Reset button or All button */}
            {canReset ? (
              <button
                type="button"
                onClick={openReset}
                className="inline-flex items-center justify-center rounded-full bg-white/10 p-2 text-white/80 ring-1 ring-white/10 hover:bg-white/15"
                title="Reset progress"
                aria-label="Reset progress"
              >
                <ResetIcon />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setMode("all")}
                className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 ring-1 ring-white/10 hover:bg-white/15"
              >
                All
              </button>
            )}
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="mt-4">
        {noData ? (
          <div className="grid h-[260px] place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10">
            <div className="text-center">
              <p className="text-sm font-semibold text-white">No results yet</p>
              <p className="mt-1 text-xs text-white/60">
                Do an exam to show results.
              </p>
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Sticky Y-axis overlay */}
            <div
              className="pointer-events-none absolute left-0 top-0 z-20 h-full"
              style={{ width: STICKY_AXIS_W, background: "transparent" }}
            >
              <div className="relative h-full">
                {Y_TICKS.slice()
                  .reverse()
                  .map((v) => {
                    const top = MARGIN.top;
                    const bottom = MARGIN.bottom + X_AXIS_H;
                    const usable = CHART_H - top - bottom;
                    const y = top + ((100 - v) / 100) * usable;

                    return (
                      <div
                        key={v}
                        className="absolute left-0 w-full text-right text-[12px]"
                        style={{
                          top: y - 8,
                          paddingRight: 10,
                          color: "#94a3b8",
                          textShadow: "0 1px 2px rgba(0,0,0,0.65)",
                        }}
                      >
                        {v}
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* viewport */}
            <div
              ref={viewportRef}
              className="w-full overflow-hidden rounded-2xl"
              style={{ paddingLeft: STICKY_AXIS_W }}
            >
              {/* scroll area */}
              <div
                ref={scrollRef}
                className="w-full overflow-x-auto scrollbar-dark"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                <LineChart
                  width={svgWidth}
                  height={CHART_H}
                  data={chartData}
                  margin={MARGIN}
                >
                  <CartesianGrid
                    vertical={false}
                    horizontalPoints={horizontalPoints}
                    stroke="rgba(255,255,255,0.22)"
                    strokeDasharray="3 6"
                  />

                  <XAxis
                    dataKey="attempt"
                    axisLine={false}
                    tickLine={false}
                    tickMargin={10}
                    height={X_AXIS_H}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />

                  <YAxis
                    domain={[0, 100]}
                    ticks={[...Y_TICKS]}
                    axisLine={false}
                    tickLine={false}
                    width={0}
                    tick={false}
                  />

                  {/* ✅ Pill tooltip */}
                  <Tooltip
                    cursor={{ stroke: "rgba(255,255,255,0.35)" }}
                    content={<StampTooltip />}
                    wrapperStyle={{ outline: "none" }}
                  />

                  <Line
                    type="monotone"
                    dataKey="avg"
                    stroke="#FFC400"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#FFC400" }}
                    activeDot={{ r: 6 }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Topic pills */}
      {!lockedTopic && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode("all")}
            className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
              effectiveMode === "all"
                ? "bg-[#FFC400] text-black ring-[#FF9100]/40"
                : "bg-white/10 text-white/70 ring-white/10 hover:bg-white/15"
            }`}
          >
            All
          </button>

          {topics.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setMode(t)}
              className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                effectiveMode === t
                  ? "bg-[#FFC400] text-black ring-[#FF9100]/40"
                  : "bg-white/10 text-white/70 ring-white/10 hover:bg-white/15"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {/* ✅ Info modal — SAME STYLE AS RESET MODAL (updated text) */}
      {infoOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-6"
          onClick={closeInfo}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-[#1F1F1F] p-6 ring-1 ring-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold">Help</h3>

            <div className="mt-2 space-y-3 text-sm text-white/60">
              <p>
                The score over time graph shows your learning progress as a line
                graph. You can touch each point on the graph to reveal more
                information about individual tests you have taken.
              </p>
              <p>
                Line and dots show your running test average (0–100). Newest
                test is on the right. Scroll sideways if there are lots of attempts.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={closeInfo}
                className="w-full sm:flex-1 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold ring-1 ring-white/15 hover:bg-white/15"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset confirm modal */}
      {resetOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-6"
          onClick={closeReset}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-[#1F1F1F] p-6 ring-1 ring-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold">Reset progress?</h3>
            <p className="mt-2 text-sm text-white/60">
              This will reset the graph that tracks your progress. This can’t be
              undone.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={closeReset}
                className="w-full sm:flex-1 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold ring-1 ring-white/15 hover:bg-white/15"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmReset}
                className="w-full sm:flex-1 rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white ring-1 ring-rose-500/40 hover:bg-rose-500"
              >
                Confirm reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
