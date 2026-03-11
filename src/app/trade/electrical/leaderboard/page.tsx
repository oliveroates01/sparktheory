import { Suspense } from "react";
import ElectricalLeaderboardClient from "./ElectricalLeaderboardClient";

export default function ElectricalLeaderboardPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#1F1F1F] text-white">
          <div className="pointer-events-none fixed inset-0 overflow-hidden">
            <div className="absolute -top-40 left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#FFC400]/25 via-[#FF9100]/20 to-[#FFC400]/20 blur-3xl" />
            <div className="absolute bottom-[-220px] right-[-200px] h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-[#FFC400]/18 to-[#FF9100]/12 blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_30%_20%,rgba(255,196,0,0.14),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(700px_420px_at_70%_80%,rgba(255,145,0,0.12),transparent_60%)]" />
          </div>

          <div className="relative mx-auto w-full max-w-6xl px-6 py-6 page-transition">
            <section className="mx-auto w-full max-w-5xl">
              <div className="mt-6 rounded-2xl bg-[#1F1F1F] p-4 ring-1 ring-[#FF9100]/20 sm:p-6">
                <div className="w-full max-w-[340px] min-w-0 mx-auto sm:max-w-none rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
                  <div className="h-6 w-44 rounded-md bg-white/10 animate-pulse" />
                  <div className="mt-3 h-4 w-64 rounded bg-white/10 animate-pulse" />
                  <div className="mt-4 space-y-2">
                    <div className="h-4 w-full rounded bg-white/10 animate-pulse" />
                    <div className="h-4 w-full rounded bg-white/10 animate-pulse" />
                    <div className="h-4 w-full rounded bg-white/10 animate-pulse" />
                    <div className="h-4 w-full rounded bg-white/10 animate-pulse" />
                    <div className="h-4 w-full rounded bg-white/10 animate-pulse" />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      }
    >
      <ElectricalLeaderboardClient />
    </Suspense>
  );
}
