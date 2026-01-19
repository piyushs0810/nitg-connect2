import admin from "firebase-admin";
import dotenv from "dotenv";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

dotenv.config();

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin SDK
let serviceAccount: admin.ServiceAccount | undefined;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    // Parse service account from environment variable (JSON string)
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY) as admin.ServiceAccount;
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    // Alternative: Load from file path (relative to project root or absolute)
    const path = process.env.FIREBASE_SERVICE_ACCOUNT_PATH.startsWith("/")
      ? process.env.FIREBASE_SERVICE_ACCOUNT_PATH
      : join(__dirname, "..", "..", process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
    const fileContent = readFileSync(path, "utf-8");
    serviceAccount = JSON.parse(fileContent) as admin.ServiceAccount;
  } else {
    // For development without service account, use application default credentials
    // or initialize with minimal config (requires proper setup)
    console.warn("⚠️  Warning: No service account found. Attempting to use application default credentials.");
    console.warn("   Set FIREBASE_SERVICE_ACCOUNT_KEY or FIREBASE_SERVICE_ACCOUNT_PATH in .env");
  }
} catch (error: any) {
  console.error("Error parsing Firebase service account:", error);
  throw new Error(`Failed to initialize Firebase Admin SDK: ${error.message}. Check your service account configuration.`);
}

if (!admin.apps.length) {
  try {
    if (serviceAccount && serviceAccount.projectId) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.projectId,
      });
      console.log("✅ Firebase Admin initialized with service account");
    } else {
      // Try to use application default credentials (works with Firebase CLI or GCP)
      admin.initializeApp({
        projectId: "nitg-connect",
      });
      console.log("✅ Firebase Admin initialized with application default credentials");
    }
  } catch (error: any) {
    console.error("Error initializing Firebase Admin SDK:", error);
    throw new Error(`Failed to initialize Firebase: ${error.message}`);
  }
}

export const db = admin.firestore();
export const auth = admin.auth();
