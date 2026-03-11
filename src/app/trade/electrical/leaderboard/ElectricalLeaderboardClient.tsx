"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FirebaseError } from "firebase/app";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { backfillLeaderboardPointsFromLocalProgress } from "@/lib/leaderboard/backfill";

type LeaderboardEntry = {
  uid: string;
  username: string;
  points: number;
};

type Division = "Diamond" | "Gold" | "Silver" | "Bronze";

function divisionForRank(rank: number): Division {
  if (rank === 1) return "Diamond";
  if (rank >= 2 && rank <= 6) return "Gold";
  if (rank >= 7 && rank <= 16) return "Silver";
  return "Bronze";
}

function divisionClassName(division: Division): string {
  if (division === "Diamond") {
    return "bg-cyan-300/20 text-cyan-100 ring-cyan-200/40";
  }
  if (division === "Gold") {
    return "bg-amber-300/20 text-amber-100 ring-amber-200/40";
  }
  if (division === "Silver") {
    return "bg-slate-300/20 text-slate-100 ring-slate-200/40";
  }
  return "bg-orange-300/20 text-orange-100 ring-orange-200/40";
}

function divisionRowClassName(division: Division): string {
  if (division === "Diamond") {
    return "bg-cyan-300/10 border-cyan-200/40 shadow-[0_0_0_1px_rgba(103,232,249,0.18),0_10px_24px_rgba(34,211,238,0.10)]";
  }
  if (division === "Gold") {
    return "bg-amber-300/10 border-amber-200/35";
  }
  if (division === "Silver") {
    return "bg-slate-300/10 border-slate-200/30";
  }
  return "bg-orange-300/8 border-orange-200/25";
}

function divisionEmoji(division: Division): string {
  if (division === "Diamond") return "💎";
  if (division === "Gold") return "🥇";
  if (division === "Silver") return "🥈";
  return "🥉";
}

const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/;

function normalizePoints(value: unknown): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (typeof value === "bigint") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (value == null) {
    return 0;
  }
  return 0;
}

function normalizeLeaderboardEntries(
  docs: Array<{ id: string; data: () => { username?: unknown; points?: unknown } }>
) {
  return docs
    .map((docSnap) => {
      const data = docSnap.data();
      const username = typeof data.username === "string" ? data.username : "";
      const points = normalizePoints(data.points);
      return {
        uid: docSnap.id,
        username,
        points,
      };
    });
}

function filterRenderableEntries(entries: LeaderboardEntry[]) {
  return entries.filter((entry) => {
    const username = entry.username.trim();
    return username.length > 0 && Number.isFinite(entry.points) && entry.points >= 0;
  });
}

export default function ElectricalLeaderboardClient() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [canShowLeaderboard, setCanShowLeaderboard] = useState(true);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [leaderboardReady, setLeaderboardReady] = useState(false);
  const [showCreateUsernameForm, setShowCreateUsernameForm] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [usernameNotice, setUsernameNotice] = useState("");
  const [savingUsername, setSavingUsername] = useState(false);

  useEffect(() => {
    let ignore = false;
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!ignore) {
        setCurrentUserId(user?.uid ?? null);
      }
      if (!user) {
        if (!ignore) {
          setCanShowLeaderboard(true);
          setShowCreateUsernameForm(false);
          setUsernameError("");
          setUsernameNotice("");
        }
        return;
      }
      try {
        const userSnap = await getDoc(doc(db, "users", user.uid));
        if (ignore) return;
        const username = String(userSnap.data()?.username || "").trim();
        setCanShowLeaderboard(username.length > 0);
        setShowCreateUsernameForm(false);
        setUsernameError("");
        setUsernameNotice("");
      } catch {
        if (ignore) return;
        setCanShowLeaderboard(true);
      }
    });
    return () => {
      ignore = true;
      unsub();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadLeaderboard() {
      try {
        const usersRef = collection(db, "users");
        const leaderboardQuery = query(usersRef, orderBy("points", "desc"), limit(10));
        const snapshot = await getDocs(leaderboardQuery);
        if (cancelled) return;

        console.log("[leaderboard] snapshot.size", snapshot.size);
        snapshot.docs.forEach((docSnap) => {
          const data = docSnap.data() as { username?: unknown; points?: unknown };
          console.log("[leaderboard] doc", {
            id: docSnap.id,
            username: data.username,
            points: data.points,
          });
        });

        const normalized = normalizeLeaderboardEntries(
          snapshot.docs as Array<{ id: string; data: () => { username?: unknown; points?: unknown } }>
        );
        console.log("[leaderboard] normalized entries", normalized);

        const filtered = filterRenderableEntries(normalized);
        console.log("[leaderboard] filtered entries", filtered);

        const next = filtered
          .sort((a, b) => normalizePoints(b.points) - normalizePoints(a.points))
          .slice(0, 10);
        setEntries(next);
      } catch (error) {
        const code = (error as { code?: string } | null)?.code;
        const message = (error as { message?: string } | null)?.message || "";
        const indexUrlMatch = message.match(/https:\/\/console\.firebase\.google\.com\/[^\s)]+/);
        const indexUrl = indexUrlMatch ? indexUrlMatch[0] : "";

        console.log("[leaderboard] users query failed");
        console.warn("raw error", error);
        console.log("error code", code);
        console.log("error message", message);

        if (
          (error instanceof FirebaseError && error.code === "failed-precondition") ||
          message.toLowerCase().includes("index")
        ) {
          if (indexUrl) {
            console.log("[leaderboard] Firestore index creation URL:", indexUrl);
          } else {
            console.log(
              "[leaderboard] Missing Firestore index. Create composite index for users(points DESC)."
            );
          }
        }

        if (cancelled) return;
        setEntries([]);
      } finally {
        if (!cancelled) setLeaderboardReady(true);
      }
    }

    void loadLeaderboard();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!currentUserId) return;
    void backfillLeaderboardPointsFromLocalProgress(currentUserId).catch((error) => {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[leaderboard] points backfill skipped", { error, uid: currentUserId });
      }
    });
  }, [currentUserId]);

  const handleSaveUsername = async () => {
    const uid = currentUserId || auth.currentUser?.uid || null;
    if (!uid || savingUsername) {
      setUsernameError("Please sign in and try again.");
      return;
    }

    setUsernameError("");
    setUsernameNotice("");

    const normalizedUsername = usernameInput.trim().toLowerCase();
    if (!USERNAME_REGEX.test(normalizedUsername)) {
      setUsernameError("Username must be 3-20 characters and use only letters, numbers, or underscores.");
      return;
    }

    setSavingUsername(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setUsernameError("You need to be signed in to save a username.");
        return;
      }

      const token = await currentUser.getIdToken();
      const response = await fetch("/api/users/set-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          uid,
          username: normalizedUsername,
        }),
      });

      const result = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        throw new Error(result.error || "Could not save username. Please try again.");
      }

      setUsernameNotice("Username updated successfully.");
      setCanShowLeaderboard(true);
      setShowCreateUsernameForm(false);
      setUsernameInput("");
    } catch (error) {
      const code = (error as { code?: string } | null)?.code;
      const message = (error as { message?: string } | null)?.message;

      console.log("[leaderboard] save username failed");
      console.warn("raw error", error);
      console.log("error code", code);
      console.log("error message", message);
      console.log("uid", uid);
      console.log("usernameInput", usernameInput);

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "permission-denied":
            setUsernameError("Permission denied. Firestore rules blocked this update.");
            break;
          case "unauthenticated":
            setUsernameError("You need to be signed in to save a username.");
            break;
          case "not-found":
            setUsernameError("User profile document not found.");
            break;
          case "failed-precondition":
            setUsernameError("Save failed due to a Firestore precondition. Please try again.");
            break;
          case "already-exists":
            setUsernameError("Username already taken. Please choose another.");
            break;
          default:
            setUsernameError(error.message || "Could not save username. Please try again.");
            break;
        }
      } else {
        if (typeof message === "string" && message.includes("Username already taken")) {
          setUsernameError("Username already taken. Please choose another.");
        } else {
          setUsernameError(message || "Could not save username. Please try again.");
        }
      }
    } finally {
      setSavingUsername(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#1F1F1F] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#FFC400]/25 via-[#FF9100]/20 to-[#FFC400]/20 blur-3xl" />
        <div className="absolute bottom-[-220px] right-[-200px] h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-[#FFC400]/18 to-[#FF9100]/12 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_30%_20%,rgba(255,196,0,0.14),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(700px_420px_at_70%_80%,rgba(255,145,0,0.12),transparent_60%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-6 py-6 page-transition">
        <section className="mx-auto w-full max-w-5xl">
          <Link
            href="/trade/electrical"
            className="inline-flex rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/10"
          >
            Back
          </Link>

          <div className="mt-6 rounded-2xl bg-[#1F1F1F] p-4 ring-1 ring-[#FF9100]/20 sm:p-6">
            <div className="w-full max-w-[340px] min-w-0 mx-auto sm:max-w-none rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
              <h2 className="text-2xl font-semibold text-white">Leaderboard</h2>
              {canShowLeaderboard ? (
                <>
                  <p className="mt-2 text-sm text-white/60">
                    See how you rank against other Spark Theory users.
                  </p>
                  {leaderboardReady && entries.length === 0 ? (
                    <p className="mt-5 text-sm text-white/70">No leaderboard data yet.</p>
                  ) : (
                    <ol className="mt-5 space-y-2.5 text-sm text-white/90">
                      {entries.map((entry, index) => {
                        const division = divisionForRank(index + 1);
                        return (
                        <li
                          key={entry.uid}
                          className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2 transition duration-200 hover:brightness-110 ${divisionRowClassName(
                            division
                          )}`}
                        >
                          <span className="min-w-0 truncate">
                            {divisionEmoji(division)} {index + 1}. {entry.username}
                            <span
                              className={`ml-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${divisionClassName(
                                division
                              )}`}
                            >
                              {division}
                            </span>
                          </span>
                          <span className="shrink-0 font-semibold text-white">
                            {entry.points.toLocaleString()} pts
                          </span>
                        </li>
                      )})}
                    </ol>
                  )}
                </>
              ) : (
                <>
                  <p className="mt-2 text-sm text-white/80">
                    You need a username to appear on the leaderboard.
                  </p>
                  <p className="mt-2 text-sm text-white/60">
                    You can create or change your username in your account settings to appear on the leaderboard.
                  </p>
                  {!showCreateUsernameForm ? (
                    <div className="mt-5">
                      <button
                        type="button"
                        onClick={() => setShowCreateUsernameForm(true)}
                        className="inline-flex rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/85 transition hover:bg-white/10"
                      >
                        Create username
                      </button>
                    </div>
                  ) : (
                    <div className="mt-5 grid gap-3">
                      <label className="grid gap-2 text-sm">
                        <span className="text-white/70">Username</span>
                        <input
                          id="leaderboard-username"
                          name="leaderboardUsername"
                          type="text"
                          value={usernameInput}
                          onChange={(event) => setUsernameInput(event.target.value)}
                          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40"
                          placeholder="Choose a username"
                        />
                      </label>

                      {usernameError ? (
                        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-200">
                          {usernameError}
                        </div>
                      ) : null}
                      {usernameNotice ? (
                        <div className="rounded-xl border border-emerald-300/40 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-100">
                          {usernameNotice}
                        </div>
                      ) : null}

                      <button
                        type="button"
                        onClick={() => void handleSaveUsername()}
                        disabled={savingUsername}
                        className="inline-flex w-fit rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/85 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {savingUsername ? "Saving..." : "Save username"}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
