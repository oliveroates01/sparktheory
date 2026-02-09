"use client";

import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#1F1F1F] text-white">
      <div className="mx-auto w-full max-w-3xl px-6 py-12">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Spark Theory</p>
            <p className="text-xs text-white/60">Terms</p>
          </div>
          <Link
            href="/"
            className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/15 hover:bg-white/15"
          >
            Home
          </Link>
        </header>

        <h1 className="mt-8 text-3xl font-bold">Terms &amp; Conditions</h1>
        <p className="mt-2 text-sm text-white/60">Last Updated: 2025-09-13</p>

        <div className="mt-8 space-y-6 text-sm text-white/80">
          <p>
            About Spark Theory — Spark Theory provides educational revision content.
            Use of the app is subject to these Terms.
          </p>

          <div>
            <h2 className="text-base font-semibold">Eligibility</h2>
            <p className="mt-2">
              You must be at least 16 and capable of forming a contract under
              UK law.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold">Account Responsibility</h2>
            <p className="mt-2">
              Keep your login secure. You are responsible for all activity
              under your account. We may suspend or terminate for misuse, fraud
              or breach.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold">Acceptable Use</h2>
            <p className="mt-2">
              Do not copy, resell, reverse engineer, or misuse the service. No
              unlawful, harmful or infringing activity.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold">
              Service Availability &amp; Changes
            </h2>
            <p className="mt-2">
              We aim for high availability but do not guarantee uninterrupted
              service. We may change or discontinue features with reasonable
              notice where practicable.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold">Subscriptions &amp; Billing</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Paid features require an active subscription managed by Stripe.</li>
              <li>Billing cycles auto-renew unless you cancel.</li>
              <li>
                Prices may change; we will give reasonable notice and an option
                to cancel before changes take effect.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-semibold">Free Trials</h2>
            <p className="mt-2">
              If offered, trials convert to paid unless cancelled before the
              trial ends. We will tell you the trial length and price before you
              start.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold">Cancellation</h2>
            <p className="mt-2">
              You can cancel anytime from your Account page. Cancellation takes
              effect at the end of the current billing period unless stated
              otherwise. After cancellation, access to paid content ends when
              your current period expires.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold">Refunds</h2>
            <p className="mt-2">
              Refunds are governed by our Refund Policy. UK consumer rules may
              give you a 14-day cancellation right for digital services unless
              you ask us to start the service immediately and acknowledge you
              will lose that right — see our Refund Policy for details.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold">Intellectual Property</h2>
            <p className="mt-2">
              All content is owned by us or our licensors. You receive a
              personal, non-transferable licence to use the app for your own
              learning.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold">Limitation of Liability</h2>
            <p className="mt-2">
              Content is for revision only. We do not guarantee exam results.
              Nothing excludes liability that cannot be excluded by law.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold">Governing Law</h2>
            <p className="mt-2">
              These Terms are governed by the laws of England and Wales, and the
              courts of England and Wales have exclusive jurisdiction.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold">Contact</h2>
            <p className="mt-2">
              Questions? Email sparktheory2026@gmail.com.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
