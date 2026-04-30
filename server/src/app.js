const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const sugarRoutes = require("./routes/sugarRoutes");
const historyRoutes = require("./routes/historyRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server and local non-browser requests without Origin header.
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      const corsError = new Error("Not allowed by CORS");
      corsError.statusCode = 403;
      return callback(corsError);
    }
  })
);
app.use(express.json());

const getDbStatus = () => {
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting"
  };

  return states[mongoose.connection.readyState] || "unknown";
};

app.get("/", (req, res) => {
  res.json({
    message: "Blood Sugar Chatbot API is running",
    health: "/api/health"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    database: getDbStatus()
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/sugar", sugarRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/analytics", analyticsRoutes);

// Compatibility aliases matching the requested route shape.
app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);
app.use("/sugar", sugarRoutes);
app.use("/history", historyRoutes);
app.use("/analytics", analyticsRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
