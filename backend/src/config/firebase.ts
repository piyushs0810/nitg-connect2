import admin from "firebase-admin";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

console.log("🔥 ENV CHECK", {
  projectId,
  clientEmail,
  keyExists: Boolean(privateKey),
});

if (!projectId || !clientEmail || !privateKey) {
  throw new Error("❌ Missing Firebase environment variables");
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    } as admin.ServiceAccount),
  });

  console.log("✅ Firebase Admin initialized");
}

export const db = admin.firestore();
export const auth = admin.auth();
