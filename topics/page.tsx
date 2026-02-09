"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Card = {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  tag?: string;
};

const DATA = {
  electrical: {
    label: "Electrical",
    topics: [
      {
        id: "el-hs",
        title: "Health & Safety",
        description: "Safe isolation, PPE, risk assessment, COSHH, site safety.",
        questionCount: 40,
        tag: "Essential",
      },
      {
        id: "el-science",
        title: "Electrical Science",
        description: "Ohm’s law, power, resistance, circuits, AC/DC basics.",
        questionCount: 60,
        tag: "Core",
      },
      {
        id: "el-wiring",
        title: "Wiring Systems",
        description: "Cables, containment, accessories, installation practice.",
        questionCount: 55,
        tag: "Core",
      },
    ],
  },

  plumbing: {
    label: "Plumbing",
    topics: [
      {
        id: "pl-hs",
        title: "Health & Safety",
        description: "PPE, risk assessment, safe use of tools, COSHH basics.",
        questionCount: 40,
        tag: "Essential",
      },
      {
        id: "pl-cold",
        title: "Cold Water",
        description: "Storage, distribution, fittings, and basic system layouts.",
        questionCount: 55,
        tag: "Core",
      },
      {
        id: "pl-ch",
        title: "Central Heating",
        description: "Heat sources, controls, radiators, and system components.",
        questionCount: 50,
        tag: "Core",
      },
    ],
  },
} satisfies Record<string, { label: string; topics: Card[] }>;

type TradeKey = keyof typeof DATA;

export default function TopicsPage() {
  const router = useRouter();
  const [activeTrade, setActiveTrade] = useState<TradeKey>("electrical");

  const cards = useMemo(() => {
    return DATA[activeTrade].topics;
  }, [activeTrade]);

  const handleTradeClick = (key: TradeKey) => {
    if (key === "electrical") {
      router.push("/trade/electrical");
      return;
    }

    setActiveTrade(key);
  };

  return (
    <main className="min-h-screen bg-[#0B1020] text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500/25 via-indigo-500/20 to-purple-500/25 blur-3xl" />
        <div className="absolute bottom-[-220px] right-[-200px] h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-emerald-400/15 to-cyan-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-6 py-10">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 ring-1 ring-white/15">
              <span className="text-lg font-bold">Q</span>
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide">QuizMaster</p>
              <p className="text-xs text-white/60">Choose a trade to begin</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/15 hover:bg-white/15"
            >
              Home
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
            Choose Your <span className="text-blue-300">Trade</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/70">
            Select a trade to view available exam topics and quizzes.
          </p>
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
                    "w-72 rounded-full px-6 py-3 text-center text-sm font-semibold ring-1 transition",
                    isActive
                      ? "bg-blue-500/20 ring-blue-400/30"
                      : "bg-white/5 ring-white/10 text-white/80 hover:bg-white/10",
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">{c.title}</p>
                    <p className="mt-2 text-sm text-white/65">{c.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/60 ring-1 ring-white/10">
                      {c.questionCount} Qs
                    </span>
                    {c.tag && (
                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/60 ring-1 ring-white/10">
                        {c.tag}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-white/55">
                  <span className="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
                    Classic
                  </span>
                  <span className="font-semibold text-white/70">Coming soon →</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-14 text-center text-xs text-white/40">
          Built with Next.js • {new Date().getFullYear()}
        </footer>
      </div>
    </main>
  );
}
