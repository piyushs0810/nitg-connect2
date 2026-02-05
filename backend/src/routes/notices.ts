import express from "express";
import * as Notices from "../controllers/notices.controller.js";

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    const notices = await Notices.getAllNotices();
    res.json(notices);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const notice = await Notices.getNoticeById(req.params.id);
    if (!notice) return res.status(404).json({ error: "Not found" });
    res.json(notice);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({
        error: "title, content and category are required",
      });
    }

    const notice = await Notices.createNotice(req.body);
    res.status(201).json(notice);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const notice = await Notices.updateNotice(req.params.id, req.body);
    res.json(notice);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await Notices.deleteNotice(req.params.id);
    res.json({ message: "Notice deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;