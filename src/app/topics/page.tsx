"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import SparkTheoryLogo from "@/components/Brand/SparkTheoryLogo";
import { auth } from "@/lib/firebase";
import { getElectricalLevel3Categories } from "@/data/electricalTopicCategories";
import { healthSafetyQuestions } from "@/data/healthSafety";
import { principlesElectricalScienceQuestions } from "@/data/principlesElectricalScience";
import { electricalInstallationTechnologyQuestions } from "@/data/ElectricalInstallationTechnology";
import { installationWiringQuestions } from "@/data/installationWiring";
import { communicationWithinBSEQuestions } from "@/data/communicationWithinBSE";
import { principlesElectricalScienceLevel3Questions } from "@/data/principlesElectricalScienceLevel3";
import { electricalTechnologyLevel3Questions } from "@/data/electricalTechnologyLevel3";
import { inspectionTestingCommissioningLevel3Questions } from "@/data/inspectionTestingCommissioningLevel3";

type Card = {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  tag?: string;
};

interface TradeData {
  label: string;
  topics: Card[];
  level3?: Card[];
}

const ELECTRICAL_LEVEL3_TOPICS_FOR_TOPICS_PAGE: Card[] =
  getElectricalLevel3Categories({ includeMixed: false }).map((category) => ({
    id: `el-${category.id}`,
    title: category.title,
    description: category.description,
    questionCount: 0,
    tag: "",
  }));

const DATA = {
  electrical: {
    label: "Electrical",
    topics: [
      {
        id: "el-health-safety",
        title: "Health & Safety",
        description:
          "Key laws, risk assessments, PPE, safe isolation, and site safety basics.",
        questionCount: 0,
        tag: "",
      },
      {
        id: "el-principles",
        title: "Principles of Electrical Science",
        description:
          "Ohm’s law, voltage, current, resistance, power, and AC/DC fundamentals.",
        questionCount: 0,
        tag: "",
      },
      {
        id: "el-installation-tech",
        title: "Electrical Installation Technology",
        description:
          "Wiring systems, containment, terminations, circuit design basics, and installation methods.",
        questionCount: 0,
        tag: "",
      },
      {
        id: "el-wiring-systems",
        title: "Installation of Wiring Systems & Enclosures",
        description:
          "Cable routes, safe zones, containment (trunking/conduit), fixings, entries, and enclosures.",
        questionCount: 0,
        tag: "",
      },
      {
        id: "el-comms",
        title: "Communication within Building Services Engineering",
        description:
          "Communication methods, documentation, teamwork, and coordinating safely on site.",
        questionCount: 0,
        tag: "",
      },
    ],
    level3: ELECTRICAL_LEVEL3_TOPICS_FOR_TOPICS_PAGE,
  },

  // Plumbing trade removed for now
} satisfies Record<string, TradeData>;

type TradeKey = keyof typeof DATA;

type ProblemStat = {
  wrong: number;
  total: number;
};

type ProblemPreviewItem = {
  title: string;
  count: number;
};

type ProblemPreview = {
  totalCount: number;
  topTopics: ProblemPreviewItem[];
  sampleQuestions: string[];
  hasRealData: boolean;
};

type ProblemTopicMeta = {
  slug: string;
  title: string;
  questions: unknown[];
};

type ProblemQuestion = {
  id: string;
  question: string;
  legacyIds?: string[];
};

type DemoPt = { x: number; y: number };

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function DemoProgressChartSequential({
  values = [8, 12, 26, 18, 36, 30, 48],
  stroke = "#FFC400",
}: {
  values?: number[];
  stroke?: string;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ w: 600, h: 220 });
  const [phase, setPhase] = useState<"dot" | "draw">("dot");
  const [segmentIndex, setSegmentIndex] = useState(0);
  const [revealedDots, setRevealedDots] = useState(1);
  const [segT, setSegT] = useState(0);

  useEffect(() => {
    if (!wrapRef.current) return;
    const el = wrapRef.current;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setSize({ w: Math.max(1, r.width), h: Math.max(1, r.height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { w, h } = size;
  const padding = 18;
  const gridTop = 10;
  const gridBottom = 18;

  const pts: DemoPt[] = useMemo(() => {
    const n = values.length;
    if (n === 0) return [];
    const innerW = w - padding * 2;
    const innerH = h - (padding + gridBottom + gridTop);

    return values.map((v, i) => {
      const x = padding + (n === 1 ? innerW / 2 : (innerW * i) / (n - 1));
      const t = (v - 0) / 100;
      const y = gridTop + padding + (1 - t) * innerH;
      return { x, y };
    });
  }, [values, w, h]);

  useEffect(() => {
    let raf = 0;
    let timeout: ReturnType<typeof setTimeout> | null = null;

    if (pts.length <= 1) {
      setPhase("dot");
      setSegmentIndex(0);
      setRevealedDots(pts.length ? 1 : 0);
      setSegT(0);
      return;
    }

    setPhase("dot");
    setSegmentIndex(0);
    setRevealedDots(1);
    setSegT(0);

    const DOT_PAUSE_MS = 200;
    const SEG_MS = 1000;
    const LOOP_PAUSE_MS = 700;

    const animateSegment = (fromIdx: number) => {
      setPhase("draw");
      setSegmentIndex(fromIdx);
      setSegT(0);
      const start = performance.now();

      const tick = (now: number) => {
        const raw = clamp01((now - start) / SEG_MS);
        const t = raw * raw * (3 - 2 * raw);
        setSegT(t);

        if (t < 1) {
          raf = requestAnimationFrame(tick);
          return;
        }

        setSegT(1);
        setPhase("dot");
        setRevealedDots((prev) => Math.max(prev, fromIdx + 2));

        if (fromIdx + 1 >= pts.length - 1) {
          timeout = setTimeout(() => {
            setPhase("dot");
            setSegmentIndex(0);
            setRevealedDots(1);
            setSegT(0);
            timeout = setTimeout(() => animateSegment(0), DOT_PAUSE_MS);
          }, LOOP_PAUSE_MS);
          return;
        }

        timeout = setTimeout(() => {
          animateSegment(fromIdx + 1);
        }, DOT_PAUSE_MS);
      };

      raf = requestAnimationFrame(tick);
    };

    timeout = setTimeout(() => animateSegment(0), DOT_PAUSE_MS);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (timeout) clearTimeout(timeout);
    };
  }, [pts.length, values.join(",")]);

  const segments = useMemo(() => {
    const segs: { a: DemoPt; b: DemoPt; partial?: number }[] = [];
    if (pts.length < 2) return segs;

    const completedSegmentCount =
      phase === "dot"
        ? Math.min(segmentIndex + 1, pts.length - 1)
        : Math.min(segmentIndex, pts.length - 1);

    for (let i = 0; i < completedSegmentCount; i += 1) {
      segs.push({ a: pts[i], b: pts[i + 1] });
    }

    if (phase === "draw" && segmentIndex < pts.length - 1) {
      segs.push({ a: pts[segmentIndex], b: pts[segmentIndex + 1], partial: segT });
    }

    return segs;
  }, [pts, phase, segmentIndex, segT]);

  const visibleDotCount = Math.min(revealedDots, pts.length);

  const gridYs = Array.from({ length: 4 }, (_, i) => {
    const t = i / 3;
    return gridTop + padding + (h - (padding + gridBottom + gridTop)) * t;
  });

  return (
    <div ref={wrapRef} className="h-full w-full">
      <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        {gridYs.map((y, i) => (
          <line
            key={`grid-${i}`}
            x1={padding}
            x2={w - padding}
            y1={y}
            y2={y}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1}
            strokeDasharray="4 6"
          />
        ))}

        {[0, 20, 40, 60, 80, 100].map((val) => {
          const innerH = h - (padding + gridBottom + gridTop);
          const y = gridTop + padding + (1 - val / 100) * innerH;
          return (
            <text key={`y-${val}`} x={4} y={y + 4} fontSize="10" fill="rgba(255,255,255,0.55)">
              {val}
            </text>
          );
        })}

        {segments.map((s, idx) => {
          let x2 = s.b.x;
          let y2 = s.b.y;

          if (typeof s.partial === "number") {
            x2 = lerp(s.a.x, s.b.x, s.partial);
            y2 = lerp(s.a.y, s.b.y, s.partial);
          }

          return (
            <line
              key={`seg-${idx}`}
              x1={s.a.x}
              y1={s.a.y}
              x2={x2}
              y2={y2}
              stroke={stroke}
              strokeWidth={2.5}
              strokeLinecap="round"
            />
          );
        })}

        {pts.slice(0, visibleDotCount).map((p, i) => (
          <circle key={`dot-${i}`} cx={p.x} cy={p.y} r={4} fill={stroke} />
        ))}
      </svg>
    </div>
  );
}

const LEVEL2_PROBLEM_TOPICS: ProblemTopicMeta[] = [
  { slug: "health-safety", title: "Health & Safety", questions: healthSafetyQuestions as unknown[] },
  { slug: "principles-electrical-science", title: "Principles of Electrical Science", questions: principlesElectricalScienceQuestions as unknown[] },
  { slug: "electrical-installation-technology", title: "Electrical Installation Technology", questions: electricalInstallationTechnologyQuestions as unknown[] },
  { slug: "installation-wiring-systems-enclosures", title: "Installation Wiring Systems & Enclosures", questions: installationWiringQuestions as unknown[] },
  { slug: "communication-within-building-services-engineering", title: "Communication within BSE", questions: communicationWithinBSEQuestions as unknown[] },
];

const LEVEL3_PROBLEM_TOPICS: ProblemTopicMeta[] = [
  { slug: "principles-electrical-science", title: "Principles of Electrical Science", questions: principlesElectricalScienceLevel3Questions as unknown[] },
  { slug: "electrical-technology", title: "Electrical Technology", questions: electricalTechnologyLevel3Questions as unknown[] },
  { slug: "inspection-testing-commissioning", title: "Inspection, Testing & Commissioning", questions: inspectionTestingCommissioningLevel3Questions as unknown[] },
];

const DEMO_PROBLEM_PREVIEW_LEVEL2: ProblemPreview = {
  totalCount: 18,
  hasRealData: false,
  topTopics: [
    { title: "Health & Safety", count: 8 },
    { title: "Electrical Installation Technology", count: 5 },
    { title: "Principles of Electrical Science", count: 5 },
  ],
  sampleQuestions: [
    "Who is an appointed person for first aid?",
    "What is the primary purpose of PAT testing records?",
    "When should a circuit be isolated before work starts?",
  ],
};

const DEMO_PROBLEM_PREVIEW_LEVEL3: ProblemPreview = {
  totalCount: 10,
  hasRealData: false,
  topTopics: [
    { title: "Electrical Technology", count: 4 },
    { title: "Inspection, Testing & Commissioning", count: 3 },
    { title: "Principles of Electrical Science", count: 3 },
  ],
  sampleQuestions: [
    "What is the purpose of earthing in an installation?",
    "Which test confirms continuity of protective conductors?",
    "How does inductive reactance change with frequency?",
  ],
};

function normalizeProblemQuestion(raw: unknown, index: number): ProblemQuestion | null {
  if (!raw || typeof raw !== "object") return null;
  const rec = raw as Record<string, unknown>;
  const id = typeof rec.id === "string" ? rec.id.trim() : `q-${index + 1}`;
  const question = typeof rec.question === "string" ? rec.question.trim() : "";
  const legacyIds = Array.isArray(rec.legacyIds)
    ? rec.legacyIds.filter((x): x is string => typeof x === "string").map((x) => x.trim()).filter(Boolean)
    : [];
  if (!id || !question) return null;
  return { id, question, legacyIds: legacyIds.length > 0 ? legacyIds : undefined };
}

function loadProblemStats(key: string): Record<string, ProblemStat> {
  try {
    const raw = JSON.parse(localStorage.getItem(key) || "{}");
    if (!raw || typeof raw !== "object") return {};
    return raw as Record<string, ProblemStat>;
  } catch {
    return {};
  }
}

function scopedProgressKey(baseKey: string, userId?: string | null) {
  return userId ? `${baseKey}__uid_${userId}` : baseKey;
}

function problemPreviewFromStorage(level: "2" | "3", userId?: string | null): ProblemPreview | null {
  const topics = level === "3" ? LEVEL3_PROBLEM_TOPICS : LEVEL2_PROBLEM_TOPICS;
  const prefix = level === "3" ? "qm_problem_3_" : "qm_problem_2_";
  const topicSummaries: Array<{ title: string; count: number }> = [];
  const samplePool: Array<{ question: string; wrong: number }> = [];

  for (const topic of topics) {
    const stats = loadProblemStats(
      scopedProgressKey(`${prefix}${topic.slug}`, userId)
    );
    const normalized = topic.questions
      .map((q, i) => normalizeProblemQuestion(q, i))
      .filter((q): q is ProblemQuestion => Boolean(q));

    let topicCount = 0;
    for (const q of normalized) {
      const ids = q.legacyIds ? [q.id, ...q.legacyIds] : [q.id];
      const wrong = ids.reduce((acc, id) => acc + (Number(stats[id]?.wrong) || 0), 0);
      if (wrong <= 0) continue;
      topicCount += 1;
      samplePool.push({ question: q.question, wrong });
    }

    if (topicCount > 0) topicSummaries.push({ title: topic.title, count: topicCount });
  }

  const totalCount = topicSummaries.reduce((acc, topic) => acc + topic.count, 0);
  if (totalCount === 0) return null;

  const topTopics = [...topicSummaries].sort((a, b) => b.count - a.count).slice(0, 3);
  const sampleQuestions = [...samplePool]
    .sort((a, b) => b.wrong - a.wrong)
    .slice(0, 3)
    .map((item) => item.question);

  return {
    totalCount,
    topTopics,
    sampleQuestions,
    hasRealData: true,
  };
}

export default function TopicsPage() {
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [activeTrade, setActiveTrade] =
    useState<TradeKey>("electrical");

  const cards = useMemo(() => {
    return DATA[activeTrade].topics;
  }, [activeTrade]);

  const level3Cards = useMemo(() => {
    return DATA[activeTrade].level3 ?? [];
  }, [activeTrade]);

  const [carouselIndex, setCarouselIndex] = useState(0);
  const [showLevel3, setShowLevel3] = useState(false);
  const visibleCount = 3;
  const totalCards = cards.length;

  const [shuffledCards, setShuffledCards] = useState<Card[]>(cards);
  const [shuffledLevel3, setShuffledLevel3] = useState<Card[]>(level3Cards);

  useEffect(() => {
    const copy = [...cards];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    setShuffledCards(copy);
  }, [cards]);

  useEffect(() => {
    setShuffledLevel3(level3Cards);
  }, [level3Cards]);

  const activeSet = showLevel3 ? shuffledLevel3 : shuffledCards;
  const activeTotal = activeSet.length;

  const visibleCards = Array.from({ length: Math.min(visibleCount, activeTotal) })
    .map((_, i) => activeSet[(carouselIndex + i) % activeTotal]);

  useEffect(() => {
    setCarouselIndex(0);
  }, [activeTotal]);

  const demoChartValues = [0, 18, 26, 21, 34, 42, 38, 51, 48, 63];
  const [problemPreview, setProblemPreview] = useState<ProblemPreview | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUserId(user?.uid ?? null);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const refresh = () => {
      const level: "2" | "3" = showLevel3 ? "3" : "2";
      const fromStorage = problemPreviewFromStorage(level, currentUserId);
      if (fromStorage) {
        setProblemPreview(fromStorage);
        return;
      }
      setProblemPreview(level === "3" ? DEMO_PROBLEM_PREVIEW_LEVEL3 : DEMO_PROBLEM_PREVIEW_LEVEL2);
    };

    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [showLevel3, currentUserId]);

  const handleTradeClick = (key: TradeKey) => {
    if (key === "electrical") {
      router.push("/trade/electrical");
      return;
    }
    setActiveTrade(key);
  };

  const dashboardRightCards = [
    (
      <div
        key="revision-support"
        className="rounded-3xl bg-gradient-to-br from-[#2A2A2A]/82 via-[#1F1F1F]/76 to-[#2A2A2A]/82 p-7 text-sm text-white/70 ring-1 ring-white/14 shadow-[0_12px_30px_rgba(0,0,0,0.22)]"
      >
        <div className="text-base font-semibold leading-tight text-white/85">Revision support (Level 2 & 3)</div>
        <p className="mt-3 leading-6">Use revision support to review key topics, spot weaker areas, and plan what to study next. The progress chart shows a sample learning path so you can see how results shift over time as you revisit topics and improve your scores.</p>
      </div>
    ),
    (
      <div
        key="progress-tracker"
        className="rounded-3xl bg-gradient-to-br from-[#2A2A2A]/82 via-[#1F1F1F]/76 to-[#2A2A2A]/82 p-7 ring-1 ring-white/14 shadow-[0_12px_30px_rgba(0,0,0,0.22)]"
      >
        <div className="text-base font-semibold leading-tight text-white/85">Progress tracker</div>
        <div className="flex items-center justify-between">
        </div>

        <div className="mt-6 h-44 w-full">
          <DemoProgressChartSequential values={demoChartValues} stroke="#FFC400" />
        </div>
      </div>
    ),
    (
      <div
        key="problem-questions"
        className="rounded-3xl bg-gradient-to-br from-[#2A2A2A]/82 via-[#1F1F1F]/76 to-[#2A2A2A]/82 p-7 ring-1 ring-white/14 shadow-[0_12px_30px_rgba(0,0,0,0.22)]"
      >
        <div className="text-base font-semibold leading-tight text-white/85">Problem questions</div>
        <p className="mt-3 text-sm leading-6 text-white/70">
          Questions you&apos;ve missed before — practise these to improve fastest.
        </p>
        {problemPreview && (
          <>
            <p className="mt-4 text-sm text-white/85">
              {problemPreview.totalCount} problem question{problemPreview.totalCount === 1 ? "" : "s"}
              {problemPreview.hasRealData ? " tracked" : " (demo)"}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {problemPreview.topTopics.map((topic) => (
                <span
                  key={topic.title}
                  className="rounded-full border border-white/15 bg-white/5 px-2 py-1 text-xs text-white/75"
                >
                  {topic.title} ({topic.count})
                </span>
              ))}
            </div>
            <div className="mt-3 space-y-1">
              {problemPreview.sampleQuestions.map((question) => (
                <p
                  key={question}
                  className="truncate text-xs text-white/65"
                  title={question}
                >
                  • {question}
                </p>
              ))}
            </div>
          </>
        )}
        <p className="mt-4 text-xs text-white/50">
          Demo preview
        </p>
      </div>
    ),
  ];

  return (
    <main className="min-h-screen flex flex-col justify-start bg-[#1F1F1F] text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#FFC400]/25 via-[#FF9100]/20 to-[#FFC400]/20 blur-3xl" />
        <div className="absolute bottom-[-220px] right-[-200px] h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-[#FFC400]/18 to-[#FF9100]/12 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-6 py-10">
        {/* Header */}
        <header className="flex items-center justify-end">
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-white/80 hover:bg-white/10"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-white/80 hover:bg-white/10"
            >
              Subscribe
            </Link>
            <Link
              href="/account"
              className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/15 hover:bg-white/15"
            >
              Account
            </Link>
          </div>
        </header>

        {/* Hero */}
        <section className="mt-10 text-center">
          <SparkTheoryLogo />
        </section>

        {/* Trade buttons */}
        <section className="mt-10">
          <div className="flex flex-col items-center gap-4">
            {(Object.keys(DATA) as TradeKey[]).map((key) => {
              const trade = DATA[key];
              const isActive = activeTrade === key;

              return (
                <button
                  key={key}
                  onClick={() => handleTradeClick(key)}
                  className={[
                    "w-72 rounded-full px-6 py-3 text-sm font-semibold ring-1 transition-transform duration-200",
                    "bg-white/5 ring-white/10 text-white/90",
                    "hover:scale-[1.04] hover:bg-[#FF9100]/10 hover:ring-[#FF9100]/70 hover:shadow-[0_0_0_2px_rgba(255,145,0,0.45),0_18px_40px_rgba(255,145,0,0.35)]",
                  ].join(" ")}
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>{trade.label}</span>
                    <span className="text-xs font-semibold text-[#FFC400]">
                      Start lessons →
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Topic cards */}
        <section className="mt-10">
          <div className="mb-6 flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setShowLevel3(false);
                setCarouselIndex(0);
              }}
              className={[
                "rounded-full px-4 py-1.5 text-sm font-semibold ring-1 transition",
                showLevel3
                  ? "bg-white/5 text-white/70 ring-white/10 hover:bg-white/10"
                  : "bg-[#FF9100]/15 text-white ring-[#FF9100]/50",
              ].join(" ")}
            >
              Level 2
            </button>
            <button
              type="button"
              onClick={() => {
                setShowLevel3(true);
                setCarouselIndex(0);
              }}
              className={[
                "rounded-full px-4 py-1.5 text-sm font-semibold ring-1 transition",
                showLevel3
                  ? "bg-[#FF9100]/15 text-white ring-[#FF9100]/50"
                  : "bg-white/5 text-white/70 ring-white/10 hover:bg-white/10",
              ].join(" ")}
            >
              Level 3
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            <div className="flex flex-col h-full min-h-full gap-6">
              {visibleCards.map((c) => (
                <div
                  key={`${c.id}-left`}
                  className="relative min-h-[180px] overflow-hidden rounded-3xl bg-gradient-to-br from-[#2A2A2A]/82 via-[#1F1F1F]/76 to-[#2A2A2A]/82 p-8 ring-1 ring-white/14 shadow-[0_12px_30px_rgba(0,0,0,0.22)]"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(220px_140px_at_10%_0%,rgba(255,196,0,0.18),transparent_60%)] opacity-0" />
                  <div className="relative flex flex-col gap-3">
                    <div className="flex items-start gap-4">
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="h-5 w-5"
                        fill="#FFE35B"
                      >
                        <path d="M13.1 2 4.8 13.1h5l-1.7 8.9L19.2 9.8h-5.3L13.1 2Z" />
                      </svg>
                    </div>

                    <div>
                      <p className="text-base font-semibold leading-tight text-white">{c.title}</p>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/70">
                        {c.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-auto">
                <div className="relative min-h-[180px] overflow-hidden rounded-3xl bg-gradient-to-br from-[#252017]/94 via-[#1B1A17]/92 to-[#211C14]/94 p-8 ring-1 ring-[#FFC400]/30 shadow-[0_14px_34px_rgba(0,0,0,0.24)] spark-plus-glow">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(260px_160px_at_12%_0%,rgba(255,196,0,0.14),transparent_62%)]" />
                  <div className="relative flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-base font-semibold leading-tight text-white">Upgrade to Spark Theory+</p>
                      <span className="rounded-full border border-[#FFC400]/45 bg-[#FFC400]/10 px-2.5 py-1 text-[11px] font-semibold text-[#FFE083]">
                        Spark Theory+
                      </span>
                    </div>

                    <p className="text-sm leading-6 text-white/75">
                      Unlock full progress tracking, personalised weak-topic analysis, unlimited quizzes, and smart revision paths built around your performance.
                    </p>

                    <div className="space-y-1 text-xs leading-5 text-white/70">
                      <p>• Unlimited topic quizzes</p>
                      <p>• Real performance tracking</p>
                      <p>• Weak area targeting</p>
                      <p>• Exam-style mock tests</p>
                      <p>• Priority support</p>
                    </div>

                    <div className="pt-2">
                      <Link
                        href="/signup"
                        className="inline-flex items-center justify-center rounded-xl bg-[#FFC400] px-4 py-2.5 text-sm font-semibold text-[#1F1F1F] ring-1 ring-[#FFC400]/60 transition hover:bg-[#FFD54A]"
                      >
                        Upgrade Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col h-full min-h-full gap-6">
              {dashboardRightCards}
            </div>
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
    
      <style jsx>{`
        .demo-active-seg {
          animation-name: demo-active;
          animation-timing-function: ease-in-out;
          animation-fill-mode: both;
        }


        .demo-dot-fade {
          animation: demo-dot-fade 0.9s ease-out both;
        }

        @keyframes demo-dot-fade {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .demo-dot-pop {
          transform-origin: center;
          animation: demo-dot-pop 1.4s ease-out both;
        }

        @keyframes demo-active {
          0% {
            stroke-dashoffset: var(--dash, 100);
            opacity: 0;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }

        @keyframes demo-dot-pop {
          0% {
            opacity: 0;
            transform: scale(0.6);
          }
          70% {
            opacity: 1;
            transform: scale(1.03);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .spark-plus-glow {
          animation: spark-plus-glow 10s ease-in-out infinite;
        }

        @keyframes spark-plus-glow {
          0% {
            box-shadow: 0 14px 34px rgba(0, 0, 0, 0.24), 0 0 0 0 rgba(255, 196, 0, 0.06);
          }
          50% {
            box-shadow: 0 14px 34px rgba(0, 0, 0, 0.24), 0 0 28px 0 rgba(255, 196, 0, 0.12);
          }
          100% {
            box-shadow: 0 14px 34px rgba(0, 0, 0, 0.24), 0 0 0 0 rgba(255, 196, 0, 0.06);
          }
        }
      `}</style>
</main>
  );
}
