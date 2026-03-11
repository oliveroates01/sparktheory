"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, onAuthStateChanged, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { ensureUserProfile } from "@/lib/userProfile";

const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/;

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) router.replace("/account");
    });
    return () => unsub();
  }, [router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const normalizedUsername = username.trim().toLowerCase();
    if (!USERNAME_REGEX.test(normalizedUsername)) {
      setError("Username must be 3-20 characters and use only letters, numbers, or underscores.");
      return;
    }

    setLoading(true);
    try {
      const usernameCheckResp = await fetch("/api/users/check-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: normalizedUsername }),
      });
      const usernameCheck = (await usernameCheckResp.json().catch(() => ({}))) as {
        available?: boolean;
        error?: string;
      };
      if (!usernameCheckResp.ok) {
        throw new Error(usernameCheck.error || "Could not verify username.");
      }
      if (usernameCheck.available === false) {
        setError("This username is already taken.");
        return;
      }

      const cred = await createUserWithEmailAndPassword(auth, email, password);
      try {
        await updateProfile(cred.user, { displayName: normalizedUsername });
        await ensureUserProfile(cred.user, { username: normalizedUsername });
      } catch (profileErr) {
        const profileCode = (profileErr as { code?: string } | null)?.code;
        const profileMessage =
          (profileErr as { message?: string } | null)?.message || "";

        console.log("[signup] profile creation/save failed");
        console.log("raw error", profileErr);
        console.log("error code", profileCode);
        console.log("error message", profileMessage);

        if (profileMessage.includes("Username already taken")) {
          setError("This username is already taken.");
        } else if (profileMessage.includes("Invalid username")) {
          setError("Username must be 3-20 characters and use only letters, numbers, or underscores.");
        } else if (
          profileCode === "permission-denied" ||
          profileMessage.toLowerCase().includes("permission denied")
        ) {
          setError("Could not create profile.");
        } else if (profileMessage) {
          setError(profileMessage.includes("save username") ? "Could not save username." : profileMessage);
        } else {
          setError("Could not create profile.");
        }
        return;
      }
      router.replace("/account");
    } catch (err) {
      const code = (err as { code?: string } | null)?.code;
      const message = (err as { message?: string } | null)?.message || "";

      console.log("[signup] account creation failed");
      console.log("raw error", err);
      console.log("error code", code);
      console.log("error message", message);

      if (code === "auth/email-already-in-use") {
        setError("This email is already in use.");
      } else if (code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else if (code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (message.includes("Username already taken")) {
        setError("This username is already taken.");
      } else {
        setError(message || "Could not create account.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#1F1F1F] text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#FFC400]/25 via-[#FF9100]/20 to-[#FFC400]/20 blur-3xl" />
        <div className="absolute bottom-[-220px] right-[-200px] h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-[#FFC400]/18 to-[#FF9100]/12 blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-xl flex-col px-6 py-12">
        <Link href="/" className="text-sm text-white/70 hover:text-white">← Back to home</Link>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
          <h1 className="text-3xl font-semibold">Create account</h1>
          <p className="mt-2 text-sm text-white/60">Start your revision journey in minutes.</p>

          <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
            <label className="grid gap-2 text-sm">
              <span className="text-white/70">Username</span>
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40"
                placeholder="Choose a username"
              />
            </label>

            <label className="grid gap-2 text-sm">
              <span className="text-white/70">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40"
                placeholder="you@example.com"
              />
            </label>

            <label className="grid gap-2 text-sm">
              <span className="text-white/70">Password</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40"
                placeholder="••••••••"
              />
            </label>

            {error ? (
              <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-200">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#FFC400] px-4 py-3 text-sm font-semibold text-black hover:bg-[#FF9100] disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>

          <p className="mt-4 text-sm text-white/60">
            Already have an account?{" "}
            <Link href="/login" className="text-[#FFC400] hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
