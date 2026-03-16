const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes    = require("./routes/auth.routes");
const vehicleRoutes = require("./routes/vehicle.routes");
const messageRoutes = require("./routes/message.routes");
const { errorHandler } = require("./middleware/error.middleware");

const app = express();

// ── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ── Body parser ───────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" })); // reject huge payloads

// ── Database ──────────────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/auth",     authRoutes);
app.use("/vehicles", vehicleRoutes);
app.use("/messages", messageRoutes);

app.get("/", (_req, res) =>
  res.json({ status: "ok", message: "Vehicle Assist API running" })
);

// ── Global error handler ──────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));