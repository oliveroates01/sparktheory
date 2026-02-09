"use client";

import Link from "next/link";

export default function RefundsPage() {
  return (
    <main className="min-h-screen bg-[#1F1F1F] text-white">
      <div className="mx-auto w-full max-w-3xl px-6 py-12">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Spark Theory</p>
            <p className="text-xs text-white/60">Refunds</p>
          </div>
          <Link
            href="/"
            className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/15 hover:bg-white/15"
          >
            Home
          </Link>
        </header>

        <h1 className="mt-8 text-3xl font-bold">Refund &amp; Cancellation Policy</h1>
        <p className="mt-2 text-sm text-white/60">Last Updated: 2025-09-13</p>

        <div className="mt-8 space-y-6 text-sm text-white/80">
          <p>
            Spark Theory provides digital educational content delivered online.
            Your rights may include a 14-day cooling-off period under the
            Consumer Contracts (Information, Cancellation and Additional
            Charges) Regulations 2013 ("CCR 2013").
          </p>

          <div>
            <h2 className="text-base font-semibold">Your 14-day right to cancel</h2>
            <p className="mt-2">
              For distance contracts, consumers usually have 14 days from the
              day after purchase to cancel without giving a reason. We will
              refund your subscription if you cancel within this period and you
              have not asked us to start providing the digital service
              immediately.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold">Digital content provided immediately</h2>
            <p className="mt-2">
              If you choose to start your subscription immediately, you
              acknowledge that you will lose the 14-day right to cancel once
              full access is provided. We show this at checkout and in your
              confirmation email, and we record your express request to start
              now.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold">How to cancel</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                From your Account page: select Cancel Subscription and follow
                the steps.
              </li>
              <li>
                Or email sparktheory2026@gmail.com with your registered email and
                the subject “Cancel Subscription”.
              </li>
            </ul>
            <p className="mt-2">
              Cancellation normally takes effect at the end of the current
              billing period unless your statutory cooling-off right applies.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold">Refund method</h2>
            <p className="mt-2">
              Where a refund is due, we’ll process it to your original payment
              method as soon as possible and within 14 days of confirmation of
              your cancellation.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold">Billing errors</h2>
            <p className="mt-2">
              If you believe you were charged in error, contact us at
              sparktheory2026@gmail.com and we’ll review promptly.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
