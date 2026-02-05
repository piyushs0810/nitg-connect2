import express from "express";
import * as LostFound from "../controllers/lostFound.controller.js";

const router = express.Router();

// GET all items
router.get("/", async (_req, res, next) => {
  try {
    const items = await LostFound.getAllItems();
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// GET single item
router.get("/:id", async (req, res, next) => {
  try {
    const item = await LostFound.getItemById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json(item);
  } catch (err) {
    next(err);
  }
});

// CREATE item
router.post("/", async (req, res, next) => {
  try {
    const { title, description, location, type } = req.body;

    if (!title || !description || !location || !type) {
      return res.status(400).json({
        error: "Title, description, location, and type are required",
      });
    }

    if (!["lost", "found"].includes(type)) {
      return res.status(400).json({
        error: "Type must be 'lost' or 'found'",
      });
    }

    const item = await LostFound.createItem(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

// UPDATE item
router.put("/:id", async (req, res, next) => {
  try {
    const item = await LostFound.updateItem(req.params.id, req.body);
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// DELETE item
router.delete("/:id", async (req, res, next) => {
  try {
    await LostFound.deleteItem(req.params.id);
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    next(err);
  }
});

export default router;