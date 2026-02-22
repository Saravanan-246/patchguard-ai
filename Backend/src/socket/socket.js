const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

let io;

/* =============================
   Initialize Socket Server
============================= */
const initSocket = (server) => {
  if (io) return io;

  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket"], // Prevent polling spam
  });

  /* =============================
     Socket Authentication Middleware
  ============================= */
  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(" ")[1];

      if (!token) {
        return next(new Error("Authentication error: No token"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; // Attach user to socket
      next();
    } catch (err) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  /* =============================
     On Connection
  ============================= */
  io.on("connection", (socket) => {
    console.log(`🟢 Socket Connected: ${socket.id} | User: ${socket.user?.userId}`);

    /* ===== Join System Room ===== */
    socket.on("joinSystem", (systemId) => {
      if (!systemId) return;

      const roomName = `system:${systemId}`;
      socket.join(roomName);

      console.log(`📦 ${socket.id} joined ${roomName}`);
    });

    /* ===== Leave System Room ===== */
    socket.on("leaveSystem", (systemId) => {
      if (!systemId) return;

      const roomName = `system:${systemId}`;
      socket.leave(roomName);

      console.log(`📤 ${socket.id} left ${roomName}`);
    });

    /* ===== Join Role Room ===== */
    if (socket.user?.role) {
      socket.join(`role:${socket.user.role}`);
    }

    /* ===== Disconnect ===== */
    socket.on("disconnect", (reason) => {
      console.log(`🔴 Socket Disconnected: ${socket.id} (${reason})`);
    });
  });

  return io;
};

/* =============================
   Get IO Instance
============================= */
const getIO = () => {
  if (!io) {
    throw new Error("❌ Socket.io not initialized!");
  }
  return io;
};

/* =============================
   Emit Global Event
============================= */
const emitEvent = (event, data) => {
  if (!io) return;
  io.emit(event, data);
};

/* =============================
   Emit To Specific System
============================= */
const emitToSystem = (systemId, event, data) => {
  if (!io) return;
  io.to(`system:${systemId}`).emit(event, data);
};

/* =============================
   Emit To Role
============================= */
const emitToRole = (role, event, data) => {
  if (!io) return;
  io.to(`role:${role}`).emit(event, data);
};

module.exports = {
  initSocket,
  getIO,
  emitEvent,
  emitToSystem,
  emitToRole,
};