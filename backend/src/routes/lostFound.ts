import express from "express";
import { db } from "../config/firebase.js";
import { FieldValue } from "firebase-admin/firestore";

const router = express.Router();

// Get all lost/found items
router.get("/", async (req, res) => {
  try {
    const snapshot = await db
      .collection("lostFound")
      .orderBy("createdAt", "desc")
      .get();

    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(items);
  } catch (error: any) {
    console.error("Error fetching items:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Get single item
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection("lostFound").doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json({
      id: doc.id,
      ...doc.data(),
    });
  } catch (error: any) {
    console.error("Error fetching item:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Create lost/found item
router.post("/", async (req, res) => {
  try {
    const { title, description, location, type, image } = req.body;

    if (!title || !description || !location || !type) {
      return res.status(400).json({ error: "Title, description, location, and type are required" });
    }

    if (!["lost", "found"].includes(type)) {
      return res.status(400).json({ error: "Type must be 'lost' or 'found'" });
    }

    const newItem = {
      title,
      description,
      location,
      type,
      image: image || null,
      createdAt: FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection("lostFound").add(newItem);

    res.status(201).json({
      id: docRef.id,
      ...newItem,
    });
  } catch (error: any) {
    console.error("Error creating item:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Update item
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, location, type, image } = req.body;

    const updateData: any = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (location) updateData.location = location;
    if (type) updateData.type = type;
    if (image !== undefined) updateData.image = image;

    updateData.updatedAt = FieldValue.serverTimestamp();

    await db.collection("lostFound").doc(id).update(updateData);

    const updatedDoc = await db.collection("lostFound").doc(id).get();
    res.json({
      id: updatedDoc.id,
      ...updatedDoc.data(),
    });
  } catch (error: any) {
    console.error("Error updating item:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Delete item
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("lostFound").doc(id).delete();
    res.json({ message: "Item deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting item:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

export default router;
