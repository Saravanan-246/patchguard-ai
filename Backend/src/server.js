require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const helmet = require("helmet");
const morgan = require("morgan");

const connectDB = require("./config/db");
const { initSocket } = require("./socket/socket");
const errorHandler = require("./middleware/errorHandler");

// Models
const System = require("./models/System");
const Vulnerability = require("./models/Vulnerability");
const Attack = require("./models/Attack");

// Engine
const AdvancedAttackEngine = require("./engines/advancedAttackEngine");

// Routes
const authRoutes = require("./routes/authRoutes");
const systemRoutes = require("./routes/systemRoutes");
const vulnerabilityRoutes = require("./routes/vulnerabilityRoutes");
const complianceRoutes = require("./routes/complianceRoutes");
const patchRoutes = require("./routes/patchRoutes");

/* ================================
   Initialize App
================================ */
const app = express();
const server = http.createServer(app);

/* ================================
   Security Middleware
================================ */
app.use(helmet());

// Required for Render / reverse proxy environments
app.set("trust proxy", 1);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

/* ================================
   CORS (Local + Production Safe)
================================ */

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://patchguard-ai.vercel.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow server tools (Postman, curl)
    if (!origin) return callback(null, true);

    // Allow exact matches
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow Vercel preview deployments
    if (origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

/* ================================
   Body Parsers
================================ */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ================================
   API Routes
================================ */
app.use("/api/auth", authRoutes);
app.use("/api/systems", systemRoutes);
app.use("/api/vulnerabilities", vulnerabilityRoutes);
app.use("/api/compliance", complianceRoutes);
app.use("/api/patches", patchRoutes);

/* ================================
   Health Check
================================ */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 PatchGuard AI Backend Running",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date(),
  });
});

/* ================================
   404 Handler
================================ */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* ================================
   Global Error Handler
================================ */
app.use(errorHandler);

/* ================================
   Start Server
================================ */
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    const io = initSocket(server);

    const attackEngine = new AdvancedAttackEngine(
      io,
      System,
      Vulnerability,
      Attack
    );

    // Attack Simulation Route
    app.post("/api/simulate-attack/:systemId", async (req, res) => {
      try {
        await attackEngine.runAttack(req.params.systemId);

        res.json({
          success: true,
          message: "Attack simulation started",
        });
      } catch (err) {
        console.error("Simulation Error:", err);
        res.status(500).json({
          success: false,
          message: "Failed to start attack simulation",
        });
      }
    });

    server.listen(PORT, () => {
      console.log(`
========================================
🚀 PatchGuard AI Backend Started
📍 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || "development"}
========================================
`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
};

startServer();

/* ================================
   Graceful Shutdown
================================ */
process.on("SIGINT", () => {
  console.log("🛑 Shutting down server...");
  server.close(() => {
    console.log("✅ Server closed.");
    process.exit(0);
  });
});