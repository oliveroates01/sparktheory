import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminServicesOrNull } from "@/lib/firebaseAdmin";

type EnsureProfilePayload = {
  uid?: string;
  email?: string;
  displayName?: string;
};

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

    if (!snapshot.exists) {
      await userRef.set({
        uid: decoded.uid,
        email,
        displayName: displayName || "",
        plan: "FREE",
        subscriptionStatus: "none",
        hasPlusAccess: false,
        manualOverride: "none",
        createdAt: now,
        updatedAt: now,
      });
      return NextResponse.json({ created: true });
    }

    const updatePayload: Record<string, unknown> = {
      updatedAt: now,
    };
    if (email) updatePayload.email = email;
    if (displayName) updatePayload.displayName = displayName;

    await userRef.set(updatePayload, { merge: true });
    return NextResponse.json({ created: false });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to ensure user profile";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

