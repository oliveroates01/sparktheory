"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

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
    level3: [
      {
        id: "el-advanced-circuits",
        title: "Advanced Circuit Design",
        description:
          "Complex circuit analysis, protection schemes, and fault calculations.",
        questionCount: 0,
        tag: "",
      },
      {
        id: "el-automation",
        title: "Automation & Controls",
        description:
          "Control systems, PLC basics, sensors, and industrial automation concepts.",
        questionCount: 0,
        tag: "",
      },
      {
        id: "el-installation-advanced",
        title: "Advanced Installation Practices",
        description:
          "Testing procedures, commissioning, and advanced installation standards.",
        questionCount: 0,
        tag: "",
      },
      {
        id: "el-power-systems",
        title: "Power Systems",
        description:
          "Distribution systems, transformers, load balancing, and power quality.",
        questionCount: 0,
        tag: "",
      },
      {
        id: "el-design-planning",
        title: "Design & Planning",
        description:
          "Design calculations, drawings, and project planning fundamentals.",
        questionCount: 0,
        tag: "",
      },
    ],
  },

  // Plumbing trade removed for now
} satisfies Record<string, TradeData>;

type TradeKey = keyof typeof DATA;

export default function TopicsPage() {
  const router = useRouter();
  const [activeTrade, setActiveTrade] =
    useState<TradeKey>("electrical");

  const cards = useMemo(() => {
    return DATA[activeTrade].topics;
  }, [activeTrade]);

  const level3Cards = useMemo(() => {
    return DATA[activeTrade].level3 ?? [];
  }, [activeTrade]);

  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
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
    const copy = [...level3Cards];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    setShuffledLevel3(copy);
  }, [level3Cards]);

  const activeSet = showLevel3 ? shuffledLevel3 : shuffledCards;
  const activeTotal = activeSet.length;

  const visibleCards = Array.from({ length: Math.min(visibleCount, activeTotal) })
    .map((_, i) => activeSet[(carouselIndex + i) % activeTotal]);

  useEffect(() => {
    if (totalCards <= visibleCount && level3Cards.length <= visibleCount) return;
    const id = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setShowLevel3((prev) => !prev);
        setCarouselIndex((prev) => (prev + 1) % Math.max(activeTotal, 1));
        setIsTransitioning(false);
      }, 500);
    }, 5500);
    return () => clearInterval(id);
  }, [totalCards, level3Cards.length, activeTotal]);

  const demoPoints = [0, 6, 22, 14, 35, 28, 48];
  const chartLeft = 40;
  const chartRight = 380;
  const chartBottom = 166;
  const chartScale = 1.6;
  const demoCoords = demoPoints.map((value, index) => {
    const x = chartLeft + index * ((chartRight - chartLeft) / (demoPoints.length - 1));
    const y = chartBottom - value * chartScale;
    return { x, y };
  });
  const demoSegments = demoCoords.slice(1).map((point, index) => {
    const prev = demoCoords[index];
    const dx = point.x - prev.x;
    const dy = point.y - prev.y;
    const len = Math.hypot(dx, dy);
    return { x1: prev.x, y1: prev.y, x2: point.x, y2: point.y, len };
  });

  const drawMs = 900;
  const pauseMs = 700;
  const resetMs = 700;
  const segmentCount = demoSegments.length;
  const [progressIndex, setProgressIndex] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const timeouts: Array<ReturnType<typeof setTimeout>> = [];

    const step = (index: number) => {
      if (cancelled) return;
      setProgressIndex(index);
      timeouts.push(
        setTimeout(() => {
          if (cancelled) return;
          setCompletedCount(index + 1);
        }, drawMs)
      );
      timeouts.push(
        setTimeout(() => {
          if (cancelled) return;
          if (index + 1 >= segmentCount) {
            timeouts.push(
              setTimeout(() => {
                if (cancelled) return;
                setCompletedCount(0);
                setProgressIndex(0);
                step(0);
              }, resetMs)
            );
            return;
          }
          step(index + 1);
        }, drawMs + pauseMs)
      );
    };

    setCompletedCount(0);
    step(0);

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, [drawMs, pauseMs, resetMs, segmentCount]);

  const handleTradeClick = (key: TradeKey) => {
    if (key === "electrical") {
      router.push("/trade/electrical");
      return;
    }
    setActiveTrade(key);
  };

  return (
    <main className="min-h-screen bg-[#1F1F1F] text-white">
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
              Sign up
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
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            <span className="text-[#FFC400]">Spark</span> <span className="text-white">Theory</span>
          </h1>
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
                    "bg-white/5 ring-white/10 text-white/80",
                    "hover:scale-[1.04] hover:bg-[#FF9100]/10 hover:ring-[#FF9100]/70 hover:shadow-[0_0_0_2px_rgba(255,145,0,0.45),0_18px_40px_rgba(255,145,0,0.35)]",
                  ].join(" ")}
                >
                  {trade.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Topic cards */}
        <section className="mt-10">
          <div className="grid gap-5 md:grid-cols-[minmax(0,520px)_1fr]">
            <div className="grid gap-5">
              <h2 className="text-lg font-semibold text-[#FFC400]">{showLevel3 ? "Level 3" : "Level 2"}</h2>
              {visibleCards.map((c) => (
                <div
                  key={c.id}
                  className={["group relative h-[190px] overflow-hidden rounded-3xl bg-gradient-to-br from-[#2A2A2A]/80 via-[#1F1F1F]/70 to-[#2A2A2A]/80 p-6 ring-1 ring-white/10 transition-all duration-700", isTransitioning ? "opacity-0 -translate-y-1" : "opacity-100 translate-y-0", "hover:-translate-y-1 hover:ring-[#FFC400]/40"].join(" ")}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(220px_140px_at_10%_0%,rgba(255,196,0,0.18),transparent_60%)] opacity-0 transition group-hover:opacity-100" />
                  <div className="relative flex h-full flex-col gap-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                        <span className="text-lg">⚡</span>
                      </div>
                      <div className="flex flex-col items-end gap-2" />
                    </div>

                    <div>
                      <p className="text-base font-semibold">{c.title}</p>
                      <p className="mt-2 text-sm text-white/70">
                        {c.description}
                      </p>
                    </div>

                    <div className="mt-auto" />
                  </div>
                </div>
              ))}
            </div>
            <div className="h-fit self-start mt-16">
              <div className="rounded-3xl bg-gradient-to-br from-[#2A2A2A]/80 via-[#1F1F1F]/70 to-[#2A2A2A]/80 p-6 text-sm text-white/70 ring-1 ring-white/10">
                <div className="text-sm font-semibold text-white/80">Revision support (Level 1 & 2)</div>
                <p className="mt-2">This page is built to support your Electrical Level 1 and Level 2 revision. Use it to review key topics, spot weaker areas, and plan what to study next. The progress chart shows a sample learning path so you can see how results shift over time as you revisit topics and improve your scores.</p>
              </div>

              <div className="mt-6 rounded-3xl bg-gradient-to-br from-[#2A2A2A]/80 via-[#1F1F1F]/70 to-[#2A2A2A]/80 p-6 ring-1 ring-white/10">
                <div className="text-sm font-semibold text-white/80">Progress tracker</div>
                <div className="flex items-center justify-between">
                </div>

                <div className="mt-5">
                  <svg viewBox="0 0 400 210" className="h-44 w-full">
                    <defs>
                      <linearGradient id="demoLine" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#FFC400" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#FF9100" stopOpacity="0.9" />
                      </linearGradient>
                    </defs>

                    {[0, 40, 80, 120, 160].map((y) => (
                      <line
                        key={y}
                        x1="40"
                        y1={y}
                        x2="380"
                        y2={y}
                        stroke="rgba(255,255,255,0.08)"
                        strokeDasharray="4 6"
                      />
                    ))}

                    {[0, 20, 40, 60, 80, 100].map((val) => {
                      const y = chartBottom - val * chartScale;
                      return (
                        <text
                          key={val}
                          x="10"
                          y={y + 4}
                          fontSize="10"
                          fill="rgba(255,255,255,0.55)"
                        >
                          {val}
                        </text>
                      );
                    })}

                    {demoSegments.map((seg, index) => {
                      const isComplete = index < completedCount;
                      const isActive = index === progressIndex;
                      if (!isComplete && !isActive) return null;
                      return (
                        <line
                          key={`${seg.x1}-${seg.x2}`}
                          x1={seg.x1}
                          y1={seg.y1}
                          x2={seg.x2}
                          y2={seg.y2}
                          stroke="url(#demoLine)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          className={isActive ? "demo-active-seg" : undefined}
                          style={{
                            strokeDasharray: seg.len,
                            strokeDashoffset: isActive ? seg.len : 0,
                            ['--dash' as string]: seg.len,
                            animationDuration: isActive ? `${drawMs}ms` : undefined,
                          }}
                        />
                      );
                    })}
                    {demoCoords.map((point, index) => {
                      if (index === 0 || index <= completedCount) {
                        return (
                          <circle
                            key={`${point.x}-${point.y}`}
                            cx={point.x}
                            cy={point.y}
                            r="4"
                            fill="#FFC400"
                            
                          />
                        );
                      }
                      return null;
                    })}

                    {['Principles', 'Health & Safety', 'Install', 'All Level 2', 'Comms', 'Power', 'Design'].map((label, index) => {
                      if (index !== 0 && index > completedCount) return null;
                      const x = chartLeft + index * ((chartRight - chartLeft) / 6);
                      return (
                        <text
                          key={label}
                          x={x}
                          y="198"
                          fontSize="9"
                          textAnchor="middle"
                          fill="rgba(255,255,255,0.55)"
                        >
                          {label}
                        </text>
                      );
                    })}
                  </svg>
                </div>
              </div>
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
      `}</style>
</main>
  );
}
