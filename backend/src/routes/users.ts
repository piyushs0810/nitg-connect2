import express from "express";

import { db } from "../config/firebase.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const snapshot = await db.collection("users").orderBy("name", "asc").limit(200).get();
    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Record<string, unknown>),
    }));
    res.json(users);
  } catch (error: any) {
    console.error("Failed to fetch users", error);
    res.status(500).json({ error: error?.message || "Failed to fetch users" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "User id is required" });
  }

  const allowedFields = [
    "name",
    "rollNo",
    "branch",
    "contactNumber",
    "hostel",
    "roomNumber",
    "batch",
    "bloodGroup",
    "birthDate",
  ];

  const updates: Record<string, unknown> = {};

  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(req.body, field)) {
      updates[field] = req.body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No valid fields provided for update" });
  }

  updates.updatedAt = new Date();

  try {
    const userRef = db.collection("users").doc(id);
    await userRef.set(updates, { merge: true });

    const updatedSnapshot = await userRef.get();
    if (!updatedSnapshot.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ id: updatedSnapshot.id, ...(updatedSnapshot.data() as Record<string, unknown>) });
  } catch (error: any) {
    console.error("Failed to update user", error);
    res.status(500).json({ error: error?.message || "Failed to update user" });
  }
});

export default router;
