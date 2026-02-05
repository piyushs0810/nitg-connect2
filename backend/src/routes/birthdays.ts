import express from "express";

import { db } from "../config/firebase.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const snapshot = await db
      .collection("users")
      .where("birthDate", "!=", null)
      .orderBy("birthDate")
      .limit(200)
      .get();

    const users = snapshot.docs
      .map((doc) => ({ id: doc.id, ...(doc.data() as Record<string, unknown>) }))
      .filter((user: Record<string, unknown>) => Boolean(user.birthDate));

    res.json(users);
  } catch (error: any) {
    console.error("Failed to fetch birthdays", error);
    res.status(500).json({ error: error?.message || "Failed to fetch birthdays" });
  }
});

export default router;
