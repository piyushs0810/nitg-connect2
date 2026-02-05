import express from "express";
import { auth, db } from "../config/firebase.js";

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

    const data: any = await response.json();

    if (!response.ok) {
      return res.status(401).json({ error: data.error?.message || "Authentication failed" });
    }

    let profileData: Record<string, any> = {};
    try {
      const docSnapshot = await db.collection("users").doc(data.localId).get();
      if (docSnapshot.exists) {
        profileData = docSnapshot.data() ?? {};
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    }

    res.json({
      token: data.idToken,
      user: {
        uid: data.localId,
        email: data.email,
        ...profileData,
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
    const {
      email,
      password,
      name,
      rollNo,
      branch,
      contactNumber,
      hostel,
      roomNumber,
      batch,
      bloodGroup,
      birthDate,
    } = req.body;

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

    const data: any = await response.json();

    if (!response.ok) {
      return res.status(400).json({ error: data.error?.message || "Signup failed" });
    }

    // Store additional user data in Firestore if needed
    const profileData: Record<string, any> = {
      email,
      createdAt: new Date(),
    };

    if (name) profileData.name = name;
    if (rollNo) profileData.rollNo = rollNo;
    if (branch) profileData.branch = branch;
    if (contactNumber) profileData.contactNumber = contactNumber;
    if (hostel) profileData.hostel = hostel;
    if (roomNumber) profileData.roomNumber = roomNumber;
    if (batch) profileData.batch = batch;
    if (bloodGroup) profileData.bloodGroup = bloodGroup;
    if (birthDate) profileData.birthDate = birthDate;

    await db.collection("users").doc(data.localId).set(profileData);

    res.json({
      token: data.idToken,
      user: {
        uid: data.localId,
        email: data.email,
        name,
        rollNo,
        branch,
        contactNumber,
        hostel,
        roomNumber,
        batch,
        bloodGroup,
        birthDate,
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
