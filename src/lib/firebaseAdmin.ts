import { getApps, initializeApp, cert, getApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function getAdminConfig() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const rawPrivateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  const privateKey = rawPrivateKey?.includes("\\n")
    ? rawPrivateKey.replace(/\\n/g, "\n")
    : rawPrivateKey;

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  return { projectId, clientEmail, privateKey };
}

export function getAdminAppOrNull() {
  const existing = getApps();
  if (existing.length > 0) return getApp();

  const config = getAdminConfig();
  if (!config) return null;

  return initializeApp({
    credential: cert({
      projectId: config.projectId,
      clientEmail: config.clientEmail,
      privateKey: config.privateKey,
    }),
  });
}

export function getAdminServicesOrNull() {
  const app = getAdminAppOrNull();
  if (!app) return null;
  return {
    auth: getAuth(app),
    db: getFirestore(app),
  };
}
