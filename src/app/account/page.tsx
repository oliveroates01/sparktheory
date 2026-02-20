"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import SparkTheoryLogo from "@/components/Brand/SparkTheoryLogo";
import { ensureUserProfile } from "@/lib/userProfile";

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

type StripeEndpoint = "checkout" | "portal" | "cancel";

type SubscriptionState = {
  hasSubscription: boolean;
  cancelAtPeriodEnd: boolean;
  status: string;
  currentPeriodEnd: number | null;
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

function formatPeriodEnd(unixSeconds: number | null) {
  if (!unixSeconds) {
    return "";
  }

  return new Date(unixSeconds * 1000).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [billingLoading, setBillingLoading] = useState<StripeEndpoint | null>(null);
  const [billingError, setBillingError] = useState("");
  const [billingNotice, setBillingNotice] = useState("");
  const [subscription, setSubscription] = useState<SubscriptionState>({
    hasSubscription: false,
    cancelAtPeriodEnd: false,
    status: "none",
    currentPeriodEnd: null,
  });

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const describe = (el: Element | null) => {
      if (!(el instanceof HTMLElement)) return String(el);
      const cls = (el.className || "").toString().trim();
      return `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ""}${cls ? `.${cls.replace(/\s+/g, ".")}` : ""}`;
    };

    const logOverlayDebug = (reason: string) => {
      const centerX = Math.floor(window.innerWidth / 2);
      const centerY = Math.floor(window.innerHeight / 2);
      const stack = document.elementsFromPoint(centerX, centerY).slice(0, 5);
      const fixedInset = Array.from(
        document.querySelectorAll<HTMLElement>("div.fixed.inset-0")
      ).map((el) => {
        const cs = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return {
          element: describe(el),
          pointerEvents: cs.pointerEvents,
          zIndex: cs.zIndex,
          position: cs.position,
          opacity: cs.opacity,
          display: cs.display,
          visibility: cs.visibility,
          coversViewport:
            rect.left <= 0 &&
            rect.top <= 0 &&
            rect.width >= window.innerWidth - 1 &&
            rect.height >= window.innerHeight - 1,
        };
      });

      const radixNodes = Array.from(
        document.querySelectorAll<HTMLElement>('[data-radix-portal], [data-state="open"]')
      ).map((el) => describe(el));

      const bodyStyle = window.getComputedStyle(document.body);
      const htmlStyle = window.getComputedStyle(document.documentElement);

      console.log("[account-debug] reason:", reason);
      console.log("[account-debug] center elementsFromPoint:", stack.map((el) => describe(el)));
      console.log("[account-debug] fixed.inset-0:", fixedInset);
      console.log("[account-debug] radix/open nodes:", radixNodes);
      console.log("[account-debug] body:", {
        overflow: bodyStyle.overflow,
        pointerEvents: bodyStyle.pointerEvents,
        inert: document.body.hasAttribute("inert"),
        ariaHidden: document.body.getAttribute("aria-hidden"),
      });
      console.log("[account-debug] html:", {
        overflow: htmlStyle.overflow,
        pointerEvents: htmlStyle.pointerEvents,
        inert: document.documentElement.hasAttribute("inert"),
        ariaHidden: document.documentElement.getAttribute("aria-hidden"),
      });
    };

    let lastMoveLog = 0;
    const onMove = (event: MouseEvent) => {
      const now = Date.now();
      if (now - lastMoveLog < 1200) return;
      lastMoveLog = now;
      const top = document.elementsFromPoint(event.clientX, event.clientY)[0] ?? null;
      console.log("[account-debug] top-under-cursor:", describe(top));
    };

    const onVisibility = () => {
      if (!document.hidden) logOverlayDebug("visibilitychange");
    };
    const onFocus = () => logOverlayDebug("focus");

    logOverlayDebug("mount");
    const t1 = window.setTimeout(() => logOverlayDebug("after-500ms"), 500);
    const t2 = window.setTimeout(() => logOverlayDebug("after-2s"), 2000);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u) {
        void ensureUserProfile(u);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadSubscription() {
      if (!user?.email) {
        setSubscription((prev) => {
          if (
            !prev.hasSubscription &&
            !prev.cancelAtPeriodEnd &&
            prev.status === "none" &&
            prev.currentPeriodEnd === null
          ) {
            return prev;
          }
          return {
            hasSubscription: false,
            cancelAtPeriodEnd: false,
            status: "none",
            currentPeriodEnd: null,
          };
        });
        return;
      }

      try {
        const token = await user.getIdToken();
        const response = await fetch("/api/stripe/subscription-status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email: user.email, uid: user.uid }),
        });

        const result = (await response.json().catch(() => ({}))) as {
          error?: string;
          hasSubscription?: boolean;
          cancelAtPeriodEnd?: boolean;
          status?: string;
          subscriptionStatus?: string;
          hasPlusAccess?: boolean;
          currentPeriodEnd?: number | null;
        };

        if (!response.ok) {
          throw new Error(result.error || "Failed to load subscription status");
        }

        if (!cancelled) {
          const hasSubscription = Boolean(
            result.hasPlusAccess ?? result.hasSubscription
          );
          const nextStatus = result.subscriptionStatus || result.status || "none";
          const nextSubscription = {
            hasSubscription,
            cancelAtPeriodEnd: Boolean(result.cancelAtPeriodEnd),
            status: nextStatus,
            currentPeriodEnd:
              typeof result.currentPeriodEnd === "number" ? result.currentPeriodEnd : null,
          };

          setSubscription((prev) => {
            if (
              prev.hasSubscription === nextSubscription.hasSubscription &&
              prev.cancelAtPeriodEnd === nextSubscription.cancelAtPeriodEnd &&
              prev.status === nextSubscription.status &&
              prev.currentPeriodEnd === nextSubscription.currentPeriodEnd
            ) {
              return prev;
            }
            return nextSubscription;
          });

        }
      } catch (error) {
        if (!cancelled) {
          const message = error instanceof Error ? error.message : "Failed to load subscription status";
          setBillingError(message);
        }
      }
    }

    void loadSubscription();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const data: AccountData = useMemo(() => {
    const email = user?.email || "";
    const displayName = user?.displayName || "";
    const created = user?.metadata?.creationTime || "";

    const memberSince = created
      ? new Date(created).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "";

    const planLabel = subscription.hasSubscription ? "PLUS" : "FREE";

    const planText = subscription.cancelAtPeriodEnd
      ? `Cancels on ${formatPeriodEnd(subscription.currentPeriodEnd) || "period end"}`
      : subscription.hasSubscription
        ? "Premium Access"
        : "Standard Access";

    const subscriptionStatus = !user
      ? "Signed out"
      : subscription.cancelAtPeriodEnd
        ? "Cancelling"
        : subscription.hasSubscription
          ? "Subscribed"
          : "Free";

    return {
      brandName: "Spark Theory",
      email,
      displayName,
      planLabel,
      planText,
      subscriptionStatus,
      helpEmail: "sparktheory2026@gmail.com",
      memberSince,
    };
  }, [subscription, user]);

  async function redirectToStripe(endpoint: Exclude<StripeEndpoint, "cancel">) {
    if (!user?.email) {
      setBillingError("Please sign in before using billing.");
      return;
    }

    setBillingError("");
    setBillingNotice("");
    setBillingLoading(endpoint);

    try {
      const response = await fetch(`/api/stripe/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          uid: user.uid,
        }),
      });

      const result = (await response.json().catch(() => ({}))) as {
        error?: string;
        url?: string;
      };

      if (!response.ok || !result.url) {
        throw new Error(result.error || "Unable to start Stripe session");
      }

      window.location.href = result.url;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Billing request failed";
      setBillingError(message);
    } finally {
      setBillingLoading(null);
    }
  }

  async function cancelSubscription() {
    if (!user?.email) {
      setBillingError("Please sign in before cancelling.");
      return;
    }

    const confirmed = window.confirm(
      "Cancel subscription at the end of the current billing period?",
    );

    if (!confirmed) {
      return;
    }

    setBillingError("");
    setBillingNotice("");
    setBillingLoading("cancel");

    try {
      const response = await fetch("/api/stripe/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

      const result = (await response.json().catch(() => ({}))) as {
        error?: string;
        cancelAtPeriodEnd?: boolean;
        currentPeriodEnd?: number | null;
      };

      if (!response.ok) {
        throw new Error(result.error || "Unable to cancel subscription");
      }

      const periodEnd =
        typeof result.currentPeriodEnd === "number" ? result.currentPeriodEnd : subscription.currentPeriodEnd;

      setSubscription((prev) => ({
        ...prev,
        hasSubscription: true,
        status: "active",
        cancelAtPeriodEnd: Boolean(result.cancelAtPeriodEnd),
        currentPeriodEnd: typeof result.currentPeriodEnd === "number" ? result.currentPeriodEnd : prev.currentPeriodEnd,
      }));

      const periodEndText = formatPeriodEnd(periodEnd);
      setBillingNotice(
        periodEndText
          ? `Subscription cancelled. You will keep access until ${periodEndText}.`
          : "Subscription cancelled. You will keep access until the end of your current billing period.",
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Cancellation request failed";
      setBillingError(message);
    } finally {
      setBillingLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#1F1F1F] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-40 top-[-120px] h-[520px] w-[520px] rounded-full bg-[#FFC400]/20 blur-3xl" />
        <div className="absolute right-[-180px] top-[60px] h-[560px] w-[560px] rounded-full bg-[#FF9100]/15 blur-3xl" />
        <div className="absolute bottom-[-220px] left-1/2 h-[680px] w-[680px] -translate-x-1/2 rounded-full bg-[#FFC400]/10 blur-3xl" />
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6">
        <div className="flex items-center gap-4">
          <SparkTheoryLogo compact />
          <div className="text-xs text-white/60">Account</div>
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

        {billingError ? (
          <div className="mb-6 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">
            {billingError}
          </div>
        ) : null}
        {billingNotice ? (
          <div className="mb-6 rounded-xl border border-emerald-300/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
            {billingNotice}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.05fr_1fr]">
          <section className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
            <h1 className="text-3xl font-semibold tracking-tight">My Account</h1>
            <p className="mt-2 text-sm text-white/65">
              Manage your profile, billing, subscription, and settings.
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
                {!subscription.hasSubscription ? (
                  <button
                    type="button"
                    disabled={!user || billingLoading !== null}
                    className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={() => void redirectToStripe("checkout")}
                  >
                    {billingLoading === "checkout" ? "Redirecting..." : "Upgrade to Spark Theory +"}
                  </button>
                ) : null}
              </div>
            </div>
          </section>

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
              {subscription.cancelAtPeriodEnd ? (
                <p className="mt-3 text-sm text-amber-200">
                  You will keep access until{" "}
                  {formatPeriodEnd(subscription.currentPeriodEnd) || "the end of your current billing period"}.
                </p>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={!user || billingLoading !== null}
                  className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={() => void redirectToStripe("portal")}
                >
                  {billingLoading === "portal" ? "Opening..." : "Manage billing"}
                </button>

                {subscription.hasSubscription && !subscription.cancelAtPeriodEnd ? (
                  <button
                    type="button"
                    disabled={!user || billingLoading !== null}
                    className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-100 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={() => void cancelSubscription()}
                  >
                    {billingLoading === "cancel" ? "Cancelling..." : "Cancel subscription"}
                  </button>
                ) : null}
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

        <div className="mt-10 text-center text-xs text-white/40">Built with Next.js • 2026</div>
      </main>
    </div>
  );
}
