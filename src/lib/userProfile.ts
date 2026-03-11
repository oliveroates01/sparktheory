import type { User } from "firebase/auth";

type EnsureUserProfileInput = {
  username?: string;
};

export async function ensureUserProfile(user: User, input?: EnsureUserProfileInput) {
  const token = await user.getIdToken();
  const response = await fetch("/api/users/ensure-profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || "",
      username: input?.username || "",
    }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(payload.error || "Failed to ensure user profile");
  }
}
