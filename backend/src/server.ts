import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import lostFoundRoutes from "./routes/lostFound.js";
import noticesRoutes from "./routes/notices.js";
import marketplaceRoutes from "./routes/marketplace.js";
import usersRoutes from "./routes/users.js";
import clubsRoutes from "./routes/clubs.js";
import birthdaysRoutes from "./routes/birthdays.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/lost-found", lostFoundRoutes);
app.use("/api/notices", noticesRoutes);
app.use("/api/marketplace", marketplaceRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/clubs", clubsRoutes);
app.use("/api/birthdays", birthdaysRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "NITG Connect API is running" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("🔥 REAL ERROR:", err);
  res.status(500).json({
    error: err?.message || err,
    stack: err?.stack,
  });
});
