import express from "express";

import { db } from "../config/firebase.js";

const router = express.Router();
const collection = db.collection("clubs");

router.get("/", async (_req, res) => {
  try {
    const snapshot = await collection.orderBy("name", "asc").get();
    const clubs = snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() ?? {}) }));
    res.json(clubs);
  } catch (error: any) {
    console.error("Failed to fetch clubs", error);
    res.status(500).json({ error: error?.message || "Failed to fetch clubs" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, president, contact, description, leads } = req.body;

    if (!name || !president) {
      return res.status(400).json({ error: "Name and president are required" });
    }

    const newClub = {
      name,
      president,
      contact: contact ?? null,
      description: description ?? "",
      leads: leads ?? "",
      createdAt: new Date(),
    };

    const docRef = await collection.add(newClub);
    res.status(201).json({ id: docRef.id, ...newClub });
  } catch (error: any) {
    console.error("Failed to create club", error);
    res.status(500).json({ error: error?.message || "Failed to create club" });
  }
});

export default router;
