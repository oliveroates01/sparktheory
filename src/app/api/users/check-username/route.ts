import { NextResponse } from "next/server";
import { getAdminServicesOrNull } from "@/lib/firebaseAdmin";

type CheckUsernamePayload = {
  username?: string;
};

const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/;

function normalizeUsername(raw?: string): string {
  return (raw || "").trim().toLowerCase();
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

    const payload = (await request.json().catch(() => ({}))) as CheckUsernamePayload;
    const usernameLower = normalizeUsername(payload.username);
    if (!USERNAME_REGEX.test(usernameLower)) {
      return NextResponse.json(
        { error: "Username must be 3-20 characters and use only letters, numbers, or underscores." },
        { status: 400 }
      );
    }

    const usersMatch = await services.db
      .collection("users")
      .where("usernameLower", "==", usernameLower)
      .limit(1)
      .get();
    if (!usersMatch.empty) {
      return NextResponse.json({ available: false });
    }

    const claimDoc = await services.db.collection("usernames").doc(usernameLower).get();
    if (claimDoc.exists) {
      return NextResponse.json({ available: false });
    }

    return NextResponse.json({ available: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to check username";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
