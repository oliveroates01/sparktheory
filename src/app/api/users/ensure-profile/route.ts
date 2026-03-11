import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminServicesOrNull } from "@/lib/firebaseAdmin";

type EnsureProfilePayload = {
  uid?: string;
  email?: string;
  displayName?: string;
  username?: string;
};

const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/;

function normalizeUsername(raw?: string): string {
  return (raw || "").trim().toLowerCase();
}

function getBearerToken(request: Request): string {
  const authHeader = request.headers.get("authorization") || "";
  if (!authHeader.toLowerCase().startsWith("bearer ")) return "";
  return authHeader.slice(7).trim();
}

export async function POST(request: Request) {
  try {
    const services = getAdminServicesOrNull();
    if (!services) {
      return NextResponse.json(
        { error: "Missing Firebase admin environment variables" },
        { status: 500 }
      );
    }

    const token = getBearerToken(request);
    if (!token) {
      return NextResponse.json({ error: "Missing bearer token" }, { status: 401 });
    }

    const decoded = await services.auth.verifyIdToken(token);
    const payload = (await request.json().catch(() => ({}))) as EnsureProfilePayload;

    if (!payload.uid || payload.uid !== decoded.uid) {
      return NextResponse.json({ error: "Invalid uid" }, { status: 403 });
    }

    const userRef = services.db.collection("users").doc(decoded.uid);
    const snapshot = await userRef.get();
    const now = FieldValue.serverTimestamp();
    const email = payload.email || decoded.email || "";
    const displayName = payload.displayName || decoded.name || "";
    const hasUsernameInput = typeof payload.username === "string";
    const username = hasUsernameInput ? normalizeUsername(payload.username) : "";
    const hasUsername = username.length > 0;

    if (hasUsername && !USERNAME_REGEX.test(username)) {
      return NextResponse.json({ error: "Invalid username" }, { status: 400 });
    }

    if (hasUsername) {
      const existingByUsername = await services.db
        .collection("users")
        .where("usernameLower", "==", username)
        .limit(1)
        .get();
      if (!existingByUsername.empty && existingByUsername.docs[0].id !== decoded.uid) {
        return NextResponse.json(
          { error: "Username already taken. Please choose another." },
          { status: 409 }
        );
      }
    }

    if (!snapshot.exists) {
      const createPayload: Record<string, unknown> = {
        uid: decoded.uid,
        email,
        displayName: displayName || "",
        points: 0,
        plan: "FREE",
        subscriptionStatus: "none",
        hasPlusAccess: false,
        manualOverride: "none",
        createdAt: now,
        updatedAt: now,
      };
      if (hasUsername) {
        createPayload.username = username;
        createPayload.usernameLower = username;
      }
      await userRef.set(createPayload);
      return NextResponse.json({ created: true });
    }

    const snapshotData = snapshot.data() || {};
    const updatePayload: Record<string, unknown> = {
      updatedAt: now,
    };
    if (email) updatePayload.email = email;
    if (displayName) updatePayload.displayName = displayName;
    if (hasUsername) {
      updatePayload.username = username;
      updatePayload.usernameLower = username;
    }
    const existingPoints = snapshotData.points;
    if (typeof existingPoints !== "number" || !Number.isFinite(existingPoints)) {
      updatePayload.points = 0;
    }

    await userRef.set(updatePayload, { merge: true });
    return NextResponse.json({ created: false });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to ensure user profile";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
