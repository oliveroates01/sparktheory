import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminServicesOrNull } from "@/lib/firebaseAdmin";

type SetUsernamePayload = {
  uid?: string;
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
    const payload = (await request.json().catch(() => ({}))) as SetUsernamePayload;
    if (!payload.uid || payload.uid !== decoded.uid) {
      return NextResponse.json({ error: "Invalid uid" }, { status: 403 });
    }

    const usernameLower = normalizeUsername(payload.username);
    if (!USERNAME_REGEX.test(usernameLower)) {
      return NextResponse.json(
        { error: "Username must be 3-20 characters and use only letters, numbers, or underscores." },
        { status: 400 }
      );
    }

    const userRef = services.db.collection("users").doc(decoded.uid);
    const claimRef = services.db.collection("usernames").doc(usernameLower);

    try {
      await services.db.runTransaction(async (tx) => {
        const userSnap = await tx.get(userRef);
        const claimSnap = await tx.get(claimRef);

        const claimUid = claimSnap.exists ? String(claimSnap.data()?.uid || "") : "";
        if (claimUid && claimUid !== decoded.uid) {
          throw new Error("USERNAME_TAKEN");
        }

        const currentData = userSnap.exists ? userSnap.data() || {} : {};
        const currentLower =
          typeof currentData.usernameLower === "string"
            ? currentData.usernameLower.trim().toLowerCase()
            : "";
        const currentPoints = currentData.points;
        const points =
          typeof currentPoints === "number" && Number.isFinite(currentPoints)
            ? currentPoints
            : 0;

        if (currentLower && currentLower !== usernameLower) {
          const oldClaimRef = services.db.collection("usernames").doc(currentLower);
          const oldClaimSnap = await tx.get(oldClaimRef);
          const oldClaimUid = oldClaimSnap.exists ? String(oldClaimSnap.data()?.uid || "") : "";
          if (oldClaimUid === decoded.uid) {
            tx.delete(oldClaimRef);
          }
        }

        tx.set(
          userRef,
          {
            username: usernameLower,
            usernameLower,
            points,
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true }
        );

        tx.set(
          claimRef,
          {
            uid: decoded.uid,
            username: usernameLower,
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to set username";
      if (message === "USERNAME_TAKEN") {
        return NextResponse.json(
          { error: "Username already taken. Please choose another." },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to set username";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
