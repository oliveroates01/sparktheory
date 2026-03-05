"use client";

import Link from "next/link";
import { type ReactNode, useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth } from "@/lib/firebase";
import { db } from "@/lib/firebase";
import { normalizeManualOverride, resolvePlusAccess } from "@/lib/entitlements";

const PLUS_ACCESS_CACHE_PREFIX = "qm_plus_access_";

type Props = {
  children: ReactNode;
};

export default function ToolboxAccessGate({ children }: Props) {
  const [hasPlusAccess, setHasPlusAccess] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [subscriptionReady, setSubscriptionReady] = useState(false);

  useEffect(() => {
    const loadSubscription = async (user: User) => {
      if (!user.email) {
        setHasPlusAccess(false);
        setSubscriptionReady(true);
        return;
      }

      let plusFromStripe = false;
      let plusFromProfile = false;

      try {
        const token = await user.getIdToken();
        const response = await fetch("/api/stripe/subscription-status", {
          method: "POST",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email: user.email, uid: user.uid }),
        });
        const result = (await response.json().catch(() => ({}))) as {
          isSubscribed?: boolean;
          hasPlusAccess?: boolean;
          hasSubscription?: boolean;
        };
        plusFromStripe = Boolean(
          result.isSubscribed ?? result.hasPlusAccess ?? result.hasSubscription
        );
      } catch {
        // ignore transient errors
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const profile = userDoc.data() as
          | {
              hasPlusAccess?: boolean;
              plan?: string;
              subscriptionStatus?: string;
              manualOverride?: string;
            }
          | undefined;
        plusFromProfile = resolvePlusAccess({
          hasPlusAccess: Boolean(profile?.hasPlusAccess),
          plan: String(profile?.plan || "FREE"),
          subscriptionStatus: String(profile?.subscriptionStatus || "none"),
          manualOverride: normalizeManualOverride(profile?.manualOverride),
        });
      } catch {
        // ignore profile lookup errors
      }

      try {
        const plus = plusFromStripe || plusFromProfile;
        setHasPlusAccess(plus);
        try {
          localStorage.setItem(`${PLUS_ACCESS_CACHE_PREFIX}${user.uid}`, plus ? "1" : "0");
        } catch {
          // ignore cache failures
        }
      } finally {
        setSubscriptionReady(true);
      }
    };

    const unsub = onAuthStateChanged(auth, (user) => {
      setAuthReady(true);
      if (!user) {
        setHasPlusAccess(false);
        setSubscriptionReady(true);
        return;
      }
      try {
        const cached = localStorage.getItem(`${PLUS_ACCESS_CACHE_PREFIX}${user.uid}`);
        if (cached === "1") setHasPlusAccess(true);
      } catch {
        // ignore cache failures
      }
      setSubscriptionReady(false);
      void loadSubscription(user);
    });
    return () => unsub();
  }, []);

  if (!authReady || !subscriptionReady) {
    return (
      <main className="min-h-screen bg-[#1F1F1F] text-white page-transition">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#FFC400]/25 via-[#FF9100]/20 to-[#FFC400]/20 blur-3xl" />
          <div className="absolute bottom-[-220px] right-[-200px] h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-[#FFC400]/18 to-[#FF9100]/12 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_30%_20%,rgba(255,196,0,0.14),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(700px_420px_at_70%_80%,rgba(255,145,0,0.12),transparent_60%)]" />
        </div>
        <div className="relative mx-auto w-full max-w-6xl px-6 py-10">
          <section className="mx-auto mt-10 max-w-2xl rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
            <p className="text-sm text-white/70">Checking your subscription access...</p>
          </section>
        </div>
      </main>
    );
  }

  if (hasPlusAccess) return <>{children}</>;

  return (
    <main className="min-h-screen bg-[#1F1F1F] text-white page-transition">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#FFC400]/25 via-[#FF9100]/20 to-[#FFC400]/20 blur-3xl" />
        <div className="absolute bottom-[-220px] right-[-200px] h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-[#FFC400]/18 to-[#FF9100]/12 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_30%_20%,rgba(255,196,0,0.14),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(700px_420px_at_70%_80%,rgba(255,145,0,0.12),transparent_60%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-6 py-10">
        <section className="mx-auto mt-10 max-w-2xl rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
          <h1 className="text-xl font-bold">Tool Box is for Plus members</h1>
          <p className="mt-2 text-sm text-white/70">
            Upgrade to Plus to use calculators like voltage drop, cable sizing, Zs, conduit fill
            and RCD.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/account"
              className="rounded-xl bg-[#FFC400] px-4 py-2.5 text-sm font-semibold text-black ring-1 ring-[#FF9100]/40 hover:bg-[#FF9100]"
            >
              Upgrade to Plus
            </Link>
            <Link
              href="/trade/electrical"
              className="inline-flex rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/10"
            >
              Back
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
