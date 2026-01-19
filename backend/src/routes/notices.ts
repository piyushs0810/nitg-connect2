import express from "express";
import { db } from "../config/firebase.js";
import { FieldValue } from "firebase-admin/firestore";

const router = express.Router();

// Get all notices
router.get("/", async (req, res) => {
  try {
    const snapshot = await db
      .collection("notices")
      .orderBy("createdAt", "desc")
      .get();

    const notices = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(notices);
  } catch (error: any) {
    console.error("Error fetching notices:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Get single notice
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection("notices").doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Notice not found" });
    }

    res.json({
      id: doc.id,
      ...doc.data(),
    });
  } catch (error: any) {
    console.error("Error fetching notice:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Create notice
router.post("/", async (req, res) => {
  try {
    const { title, content, category, author } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ error: "Title, content, and category are required" });
    }

    const newNotice = {
      title,
      content,
      category,
      author: author || "NIT Goa",
      createdAt: FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection("notices").add(newNotice);

    res.status(201).json({
      id: docRef.id,
      ...newNotice,
    });
  } catch (error: any) {
    console.error("Error creating notice:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Update notice
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category } = req.body;

    const updateData: any = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (category) updateData.category = category;

    updateData.updatedAt = FieldValue.serverTimestamp();

    await db.collection("notices").doc(id).update(updateData);

    const updatedDoc = await db.collection("notices").doc(id).get();
    res.json({
      id: updatedDoc.id,
      ...updatedDoc.data(),
    });
  } catch (error: any) {
    console.error("Error updating notice:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Delete notice
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("notices").doc(id).delete();
    res.json({ message: "Notice deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting notice:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

export default router;
