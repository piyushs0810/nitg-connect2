import express from "express";

import {
  createListing,
  deleteListing,
  getAllListings,
  getListingById,
  updateListing,
} from "../controllers/marketplace.controller.js";

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    const listings = await getAllListings();
    res.json(listings);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const listing = await getListingById(req.params.id);
    if (!listing) {
      res.status(404).json({ error: "Listing not found" });
      return;
    }
    res.json(listing);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { title, description, price, category } = req.body;

    if (!title || !description || price === undefined || !category) {
      res.status(400).json({
        error: "title, description, price, and category are required",
      });
      return;
    }

    const listing = await createListing(req.body);
    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const listing = await updateListing(req.params.id, req.body);
    res.json(listing);
  } catch (error) {
    if (error instanceof Error && error.message === "Listing not found") {
      res.status(404).json({ error: error.message });
      return;
    }
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await deleteListing(req.params.id);
    res.json({ message: "Listing deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;
