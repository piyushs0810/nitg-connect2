import express from "express";
import { auth } from "../config/firebase.js";

const router = express.Router();

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Note: Firebase Admin SDK doesn't support password authentication directly
    // You'll need to use Firebase Auth REST API or create a custom token
    // For now, this is a placeholder - you may want to verify credentials differently
    
    // Alternative: Use Firebase Auth REST API
    const firebaseAuthUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_WEB_API_KEY}`;
    
    const response = await fetch(firebaseAuthUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(401).json({ error: data.error?.message || "Authentication failed" });
    }

    res.json({
      token: data.idToken,
      user: {
        uid: data.localId,
        email: data.email,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { email, password, name, rollNo } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Use Firebase Auth REST API for signup
    const firebaseAuthUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.FIREBASE_WEB_API_KEY}`;
    
    const response = await fetch(firebaseAuthUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({ error: data.error?.message || "Signup failed" });
    }

    // Store additional user data in Firestore if needed
    if (name || rollNo) {
      const { db } = await import("../config/firebase.js");
      await db.collection("users").doc(data.localId).set({
        name,
        rollNo,
        email,
        createdAt: new Date(),
      });
    }

    res.json({
      token: data.idToken,
      user: {
        uid: data.localId,
        email: data.email,
        name,
        rollNo,
      },
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Verify token
router.post("/verify", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    const decodedToken = await auth.verifyIdToken(token);
    res.json({ user: decodedToken });
  } catch (error: any) {
    console.error("Token verification error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
