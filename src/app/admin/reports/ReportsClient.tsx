"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { collection, getDocs, limit, orderBy, query, Timestamp } from "firebase/firestore";
import SparkTheoryLogo from "@/components/Brand/SparkTheoryLogo";
import { auth, db } from "@/lib/firebase";

type QuestionReport = {
  id: string;
  createdAt: Date | null;
  questionId: string;
  topic: string;
  level: string;
  reason: string;
  note: string;
  quizUrl: string;
};

function formatDate(date: Date | null) {
  if (!date) return "—";
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ReportsClient({
  adminKeyValid,
  adminEmails,
}: {
  adminKeyValid: boolean;
  adminEmails: string[];
}) {
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reports, setReports] = useState<QuestionReport[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  const userEmail = (user?.email || "").trim().toLowerCase();
  const authAdminAllowed = Boolean(userEmail) && adminEmails.includes(userEmail);
  const canView = user ? authAdminAllowed : adminKeyValid;

  useEffect(() => {
    if (authLoading || !canView) return;
    let cancelled = false;

    const loadReports = async () => {
      setLoading(true);
      setError("");
      try {
        const q = query(
          collection(db, "questionReports"),
          orderBy("createdAt", "desc"),
          limit(200)
        );
        const snap = await getDocs(q);
        if (cancelled) return;

        const next: QuestionReport[] = snap.docs.map((docSnap) => {
          const data = docSnap.data() as Record<string, unknown>;
          const createdAtRaw = data.createdAt;
          const createdAt =
            createdAtRaw instanceof Timestamp
              ? createdAtRaw.toDate()
              : null;
          return {
            id: docSnap.id,
            createdAt,
            questionId: String(data.questionId || ""),
            topic: String(data.topic || ""),
            level: String(data.level || ""),
            reason: String(data.reason || ""),
            note: String(data.note || ""),
            quizUrl: String(data.quizUrl || ""),
          };
        });

        setReports(next);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load reports");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadReports();
    return () => {
      cancelled = true;
    };
  }, [authLoading, canView]);

  const accessMessage = useMemo(() => {
    if (authLoading) return "Checking access…";
    if (user && !authAdminAllowed) return "Signed-in user is not in admin allowlist.";
    if (!user && !adminKeyValid) return "Access denied. Add ?key=YOUR_ADMIN_KEY or sign in as an admin.";
    return "";
  }, [authLoading, user, authAdminAllowed, adminKeyValid]);

  return (
    <main className="min-h-screen bg-[#1F1F1F] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#FFC400]/20 via-[#FF9100]/12 to-[#FFC400]/16 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-6 py-10">
        <header className="flex items-start justify-between gap-4">
          <div>
            <Link href="/topics" className="inline-block">
              <SparkTheoryLogo />
            </Link>
            <p className="mt-2 text-xs text-white/60">Admin · Question Reports</p>
          </div>
          <Link
            href="/account"
            className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/15 hover:bg-white/15"
          >
            Account
          </Link>
        </header>

        <section className="mt-8 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
          <h1 className="text-xl font-bold">Question Reports</h1>
          <p className="mt-1 text-sm text-white/60">
            Latest 200 reports from Firestore `questionReports`.
          </p>

          {!canView && (
            <div className="mt-4 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {accessMessage}
            </div>
          )}

          {canView && error && (
            <div className="mt-4 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          )}

          {canView && loading && (
            <div className="mt-4 text-sm text-white/60">Loading reports…</div>
          )}

          {canView && !loading && !error && (
            <div className="mt-5 overflow-x-auto rounded-xl ring-1 ring-white/10">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-white/5 text-white/70">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold">Question ID</th>
                    <th className="px-4 py-3 font-semibold">Topic</th>
                    <th className="px-4 py-3 font-semibold">Level</th>
                    <th className="px-4 py-3 font-semibold">Reason</th>
                    <th className="px-4 py-3 font-semibold">Note</th>
                    <th className="px-4 py-3 font-semibold">Quiz URL</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r) => (
                    <tr key={r.id} className="border-t border-white/10 align-top">
                      <td className="px-4 py-3 text-white/75">{formatDate(r.createdAt)}</td>
                      <td className="px-4 py-3 font-mono text-xs text-white/85">{r.questionId || "—"}</td>
                      <td className="px-4 py-3 text-white/75">{r.topic || "—"}</td>
                      <td className="px-4 py-3 text-white/75">{r.level || "—"}</td>
                      <td className="px-4 py-3 text-white/85">{r.reason || "—"}</td>
                      <td className="max-w-[260px] px-4 py-3 text-white/70">{r.note || "—"}</td>
                      <td className="px-4 py-3">
                        {r.quizUrl ? (
                          <a
                            href={r.quizUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#FFC400] hover:text-[#FF9100]"
                          >
                            Open
                          </a>
                        ) : (
                          <span className="text-white/50">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {reports.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center text-white/55">
                        No reports found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

