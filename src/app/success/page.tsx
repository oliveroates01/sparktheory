"use client";

import Link from "next/link";
import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export default function SuccessPage() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "conversion", {
        send_to: "AW-17999737501",
        value: 26.0,
        currency: "GBP",
      });
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#1F1F1F] text-white page-transition">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#FFC400]/25 via-[#FF9100]/20 to-[#FFC400]/20 blur-3xl" />
        <div className="absolute bottom-[-220px] right-[-200px] h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-[#FFC400]/18 to-[#FF9100]/12 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 py-10">
        <section className="w-full max-w-xl rounded-2xl bg-white/5 p-8 ring-1 ring-white/10">
          <h1 className="text-3xl font-bold tracking-tight">Subscription Successful</h1>
          <p className="mt-3 text-sm text-white/75">
            Your Spark Theory+ subscription is now active.
          </p>

          <div className="mt-6">
            <Link
              href="/trade/electrical"
              className="inline-flex items-center justify-center rounded-xl bg-[#FFC400] px-4 py-2.5 text-sm font-semibold text-black ring-1 ring-[#FF9100]/40 transition hover:bg-[#FF9100]"
            >
              Go to Dashboard
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
