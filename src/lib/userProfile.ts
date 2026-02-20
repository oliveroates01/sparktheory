import type { User } from "firebase/auth";

export async function ensureUserProfile(user: User) {
  const token = await user.getIdToken();
  await fetch("/api/users/ensure-profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || "",
    }),
  });
}
