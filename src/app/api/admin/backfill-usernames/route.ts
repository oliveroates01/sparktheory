import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { getAdminServicesOrNull } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

type BackfillPayload = {
  dryRun?: boolean;
};

const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/;

function normalizeUsername(raw?: unknown): string {
  return String(raw || "")
    .trim()
    .toLowerCase();
}

function makeUsernameCandidate(base: string): string {
  const digits = Math.floor(100 + Math.random() * 900);
  const suffix = `_${digits}`;
  const trimmedBase = base.slice(0, Math.max(3, 20 - suffix.length));
  return `${trimmedBase}${suffix}`;
}

async function usernameExists(services: NonNullable<ReturnType<typeof getAdminServicesOrNull>>, usernameLower: string) {
  const claimSnap = await services.db.collection("usernames").doc(usernameLower).get();
  if (claimSnap.exists) return true;

  const usersSnap = await services.db
    .collection("users")
    .where("usernameLower", "==", usernameLower)
    .limit(1)
    .get();
  return !usersSnap.empty;
}

async function createUniqueUsernameFromBase(
  services: NonNullable<ReturnType<typeof getAdminServicesOrNull>>,
  baseUsernameLower: string
) {
  for (let i = 0; i < 50; i += 1) {
    const candidate = makeUsernameCandidate(baseUsernameLower);
    if (!USERNAME_REGEX.test(candidate)) continue;
    const exists = await usernameExists(services, candidate);
    if (!exists) return candidate;
  }
  throw new Error("UNABLE_TO_GENERATE_UNIQUE_USERNAME");
}

function getAdminSecret(request: Request): string {
  return (
    request.headers.get("ADMIN_SECRET") ||
    request.headers.get("admin_secret") ||
    request.headers.get("x-admin-secret") ||
    ""
  ).trim();
}

export async function POST(request: Request) {
  try {
    const expectedSecret = (process.env.ADMIN_SECRET || "").trim();
    if (!expectedSecret) {
      return NextResponse.json({ error: "Missing ADMIN_SECRET" }, { status: 500 });
    }

    const providedSecret = getAdminSecret(request);
    if (!providedSecret || providedSecret !== expectedSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const services = getAdminServicesOrNull();
    if (!services) {
      return NextResponse.json(
        { error: "Missing Firebase admin environment variables" },
        { status: 500 }
      );
    }

    const payload = (await request.json().catch(() => ({}))) as BackfillPayload;
    const dryRun = Boolean(payload.dryRun);

    const usersSnap = await services.db.collection("users").get();

    let scanned = 0;
    let created = 0;
    let alreadyOwned = 0;
    let conflicts = 0;
    let conflictResolved = 0;
    let invalid = 0;
    let userPatched = 0;
    let errors = 0;

    const logs: Array<Record<string, unknown>> = [];

    for (const userDoc of usersSnap.docs) {
      const data = userDoc.data() as Record<string, unknown>;
      const usernameRaw = typeof data.username === "string" ? data.username : "";
      const usernameLowerRaw = typeof data.usernameLower === "string" ? data.usernameLower : "";

      const normalizedFromUser = normalizeUsername(usernameRaw);
      const normalizedFromLower = normalizeUsername(usernameLowerRaw);
      const usernameLower = normalizedFromLower || normalizedFromUser;

      if (!usernameLower) continue;

      scanned += 1;

      if (!USERNAME_REGEX.test(usernameLower)) {
        invalid += 1;
        logs.push({
          uid: userDoc.id,
          action: "invalid_username",
          username: usernameRaw || null,
          usernameLower: usernameLower || null,
        });
        continue;
      }

      try {
        // Keep users/{uid}.usernameLower consistent with normalized username.
        if (normalizedFromLower !== usernameLower) {
          if (!dryRun) {
            await userDoc.ref.set(
              {
                usernameLower,
                updatedAt: FieldValue.serverTimestamp(),
              },
              { merge: true }
            );
          }
          userPatched += 1;
          logs.push({
            uid: userDoc.id,
            action: "patch_user_usernameLower",
            usernameLower,
            dryRun,
          });
        }

        const claimRef = services.db.collection("usernames").doc(usernameLower);
        const claimSnap = await claimRef.get();
        const claimUid = claimSnap.exists ? String(claimSnap.data()?.uid || "") : "";

        if (!claimSnap.exists) {
          if (!dryRun) {
            await claimRef.set(
              {
                uid: userDoc.id,
                username: usernameLower,
                updatedAt: FieldValue.serverTimestamp(),
              },
              { merge: true }
            );
          }
          created += 1;
          logs.push({
            uid: userDoc.id,
            usernameLower,
            action: "created_username_claim",
            dryRun,
          });
          continue;
        }

        if (claimUid === userDoc.id) {
          alreadyOwned += 1;
          logs.push({
            uid: userDoc.id,
            usernameLower,
            action: "already_owned",
          });
          continue;
        }

        conflicts += 1;
        const newUsernameLower = await createUniqueUsernameFromBase(services, usernameLower);

        if (!dryRun) {
          await userDoc.ref.set(
            {
              username: newUsernameLower,
              usernameLower: newUsernameLower,
              updatedAt: FieldValue.serverTimestamp(),
            },
            { merge: true }
          );

          await services.db
            .collection("usernames")
            .doc(newUsernameLower)
            .set(
              {
                uid: userDoc.id,
                username: newUsernameLower,
                updatedAt: FieldValue.serverTimestamp(),
              },
              { merge: true }
            );
        }

        conflictResolved += 1;
        logs.push({
          uid: userDoc.id,
          action: "conflict_resolved",
          oldUsernameLower: usernameLower,
          newUsernameLower,
          existingUid: claimUid || null,
          dryRun,
        });
      } catch (error) {
        errors += 1;
        logs.push({
          uid: userDoc.id,
          usernameLower,
          action: "error",
          error: error instanceof Error ? error.message : "unknown_error",
        });
      }
    }

    return NextResponse.json({
      ok: true,
      dryRun,
      scanned,
      created,
      alreadyOwned,
      conflicts,
      conflictResolved,
      invalid,
      userPatched,
      errors,
      logs,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Backfill failed";
    console.error("admin.backfill-usernames.error", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return POST(request);
}
