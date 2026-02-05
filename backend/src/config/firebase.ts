import admin from "firebase-admin";
import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (!admin.apps.length) {
  const serviceAccountPath = join(
    __dirname,
    "..",
    "..",
    "serviceAccountKey.json"
  );

  const serviceAccount = JSON.parse(
    readFileSync(serviceAccountPath, "utf-8")
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log("✅ Firebase Admin initialized");
}

export const db = admin.firestore();
export const auth = admin.auth();