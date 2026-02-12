"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";

type AccountData = {
  brandName: string;
  email: string;
  displayName?: string;
  planLabel: string;
  planText: string;
  subscriptionStatus: string;
  helpEmail: string;
  memberSince: string;
};

function initialsFromEmail(email: string) {
  const name = email.split("@")[0] || "U";
  const parts = name.replace(/[^a-z0-9]+/gi, " ").trim().split(" ");
  const first = parts[0]?.[0] ?? "U";
  const last = parts[1]?.[0] ?? "";
  return (first + last).toUpperCase();
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-medium text-white/80">
      {children}
    </span>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const data: AccountData = useMemo(() => {
    const email = user?.email || "";
    const displayName = user?.displayName || "";
    const created = user?.metadata?.creationTime || "";

    return {
      brandName: "Spark Theory",
      email,
      displayName,
      planLabel: "FREE",
      planText: "Standard Access",
      subscriptionStatus: user ? "Active" : "Signed out",
      helpEmail: "sparktheory2026@gmail.com",
      memberSince: created ? new Date(created).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }) : "",
    };
  }, [user]);

  return (
    <div className="min-h-screen bg-[#1F1F1F] text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-40 top-[-120px] h-[520px] w-[520px] rounded-full bg-[#FFC400]/20 blur-3xl" />
        <div className="absolute right-[-180px] top-[60px] h-[560px] w-[560px] rounded-full bg-[#FF9100]/15 blur-3xl" />
        <div className="absolute bottom-[-220px] left-1/2 h-[680px] w-[680px] -translate-x-1/2 rounded-full bg-[#FFC400]/10 blur-3xl" />
      </div>

      {/* Top bar */}
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
            <span className="text-sm font-bold">P</span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">{data.brandName}</div>
            <div className="text-xs text-white/60">Account</div>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <Link
            href="/"
            className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-white/80 hover:bg-white/10"
          >
            Home
          </Link>
          <Link
            href="/trade/electrical"
            className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-white/80 hover:bg-white/10"
          >
            Topics
          </Link>
        </nav>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-14">
        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 text-sm text-white/70">
            Loading account...
          </div>
        ) : null}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.05fr_1fr]">
          {/* LEFT: account summary */}
          <section className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
            <h1 className="text-3xl font-semibold tracking-tight">My Account</h1>
            <p className="mt-2 text-sm text-white/65">
              Manage your profile, subscription, and account settings.
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.05] p-5">
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-white/10 text-sm font-bold">
                  {initialsFromEmail(data.email)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-lg font-semibold">
                    {data.displayName || (data.email ? "Account" : "Guest")}
                  </div>
                  <div className="mt-1 text-sm text-white/60">{data.email || "Not signed in"}</div>
                </div>
                <Pill>{data.subscriptionStatus}</Pill>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="text-xs text-white/60">Plan</div>
                  <div className="mt-1 text-sm font-semibold">{data.planLabel}</div>
                  <div className="text-xs text-white/60">{data.planText}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="text-xs text-white/60">Member since</div>
                  <div className="mt-1 text-sm font-semibold">{data.memberSince || "—"}</div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
                >
                  Manage subscription
                </button>
              </div>
            </div>
          </section>

          {/* RIGHT: details and billing */}
          <section className="grid gap-6">
            <Section title="Account details">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-white/60">Email</span>
                  <span className="truncate font-medium">{data.email || "Not signed in"}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-white/60">Plan</span>
                  <span className="font-medium">{data.planLabel}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-white/60">Status</span>
                  <span className="font-medium">{data.subscriptionStatus}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-white/60">Member since</span>
                  <span className="font-medium">{data.memberSince || "—"}</span>
                </div>
              </div>
            </Section>

            <Section title="Billing & subscription">
              <p className="text-sm text-white/60">
                Manage your plan, billing details, and invoices.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
                >
                  Manage billing
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-white/80 hover:bg-white/10"
                >
                  Download invoices
                </button>
              </div>
            </Section>

            <Section title="Support">
              <p className="text-sm text-white/60">
                Need help with your account or billing?
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={`mailto:${data.helpEmail}`}
                  className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
                >
                  Email support
                </a>
              </div>
            </Section>

            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
              <button
                type="button"
                className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-white/85 hover:bg-white/10"
                onClick={async () => {
                  await signOut(auth);
                  router.replace("/");
                }}
              >
                Log out
              </button>
            </div>
          </section>
        </div>

        <div className="mt-10 text-center text-xs text-white/40">
          Built with Next.js • 2026
        </div>
      </main>
    </div>
  );
}
