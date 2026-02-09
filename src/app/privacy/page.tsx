"use client";

import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#1F1F1F] text-white">
      <div className="mx-auto w-full max-w-3xl px-6 py-12">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Spark Theory</p>
            <p className="text-xs text-white/60">Privacy</p>
          </div>
          <Link
            href="/"
            className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/15 hover:bg-white/15"
          >
            Home
          </Link>
        </header>

        <h1 className="mt-8 text-3xl font-bold">Privacy Policy</h1>
        <p className="mt-2 text-sm text-white/60">Last Updated: 2025-09-13</p>

        <div className="mt-8 space-y-6 text-sm text-white/80">
          <p>
            Spark Theory (“we”, “us”) is committed to protecting your privacy.
            This notice explains what personal data we collect, how we use it,
            and your rights under UK data protection law.
          </p>

          <div>
            <h2 className="text-base font-semibold">Who we are (Data Controller)</h2>
            <p className="mt-2">
              Spark Theory is the data controller. Contact: sparktheory2026@gmail.com.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold">What we collect</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Email address and password (authentication).</li>
              <li>
                Subscription/payment metadata from Stripe (we do not store full
                card details).
              </li>
              <li>
                In-app activity such as quiz progress and preferences (e.g.,
                marketing consent).
              </li>
              <li>
                Technical data like IP address, device and approximate location
                (for security, fraud prevention and service operation).
              </li>
              <li>
                Cookies or similar technologies where used (see “Cookies &
                analytics”).
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-semibold">
              How and why we use your data (lawful bases)
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Account & access — Contract.</li>
              <li>Deliver the app — Contract / Legitimate interests.</li>
              <li>Payments & subscriptions (via Stripe) — Contract / Legal obligation.</li>
              <li>
                Service communications — Contract / Legal obligation.
              </li>
              <li>
                Marketing emails — Consent under PECR; you can withdraw any time.
              </li>
              <li>Fraud/abuse prevention & security — Legitimate interests.</li>
            </ul>
            <p className="mt-2 text-white/70">
              We rely on the lawful bases set out in UK GDPR Article 6.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold">Marketing emails & your choices</h2>
            <p className="mt-2">
              We only send marketing emails if you opt in (no pre-ticked boxes).
              You can unsubscribe at any time from your Account or using the
              link in our emails. We keep records of consent (what you agreed
              to, when, and how). PECR requires a clear, positive action for
              email marketing consent.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold">Data sharing</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Firebase (authentication, database, hosting).</li>
              <li>Stripe (payments and subscription management).</li>
              <li>
                Other service providers strictly as needed to operate, secure,
                or improve the app.
              </li>
            </ul>
            <p className="mt-2 text-white/70">We do not sell your personal data.</p>
          </div>

          <div>
            <h2 className="text-base font-semibold">International transfers</h2>
            <p className="mt-2">
              Some providers may process data outside the UK. Where that occurs,
              we rely on adequate decisions or appropriate safeguards (e.g., UK
              IDTA/standard contractual clauses).
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold">Retention</h2>
            <p className="mt-2">
              We keep personal data only as long as necessary for the purposes
              above. Typical examples: account data while your account is
              active; transactional records for legal/accounting requirements;
              consent records until you withdraw plus a short audit period.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold">Cookies & analytics</h2>
            <p className="mt-2">
              If we use non-essential cookies/analytics, we will ask for consent
              and honour your choices. You can change preferences in your
              browser or via our banner (where deployed). See ICO guidance on
              cookies and consent.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold">Children</h2>
            <p className="mt-2">
              Spark Theory is not intended for users under 16. Do not register if
              you are under 16.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold">Your rights</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Access your data and get a copy.</li>
              <li>Correct inaccurate data.</li>
              <li>Delete your data (where applicable).</li>
              <li>Object or restrict certain processing.</li>
              <li>Data portability (where applicable).</li>
              <li>Withdraw consent for marketing at any time.</li>
            </ul>
            <p className="mt-2">
              To exercise rights, email sparktheory2026@gmail.com. We aim to
              respond within one month.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold">Concerns & complaints</h2>
            <p className="mt-2">
              If you have concerns, please contact us first. You also have the
              right to complain to the Information Commissioner’s Office (ICO):
              ico.org.uk/make-a-complaint or helpline 0303 123 1113.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold">Changes to this policy</h2>
            <p className="mt-2">
              If we make material changes, we will notify you in-app or by email.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
