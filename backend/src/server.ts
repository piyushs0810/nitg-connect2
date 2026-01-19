import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import lostFoundRoutes from "./routes/lostFound.js";
import noticesRoutes from "./routes/notices.js";

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

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "NITG Connect API is running" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
