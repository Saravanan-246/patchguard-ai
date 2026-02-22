import { io } from "socket.io-client";

/* ===============================
   Socket Configuration
=============================== */

const SOCKET_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

// Get token dynamically
const getToken = () => localStorage.getItem("token");

const socket = io(SOCKET_URL, {
  transports: ["websocket"],        // Prevent polling spam
  autoConnect: false,               // ⚠️ Important (manual connect)
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
  withCredentials: true,
  auth: {
    token: getToken(),              // ✅ Send JWT
  },
});

/* ===============================
   Manual Connect Function
=============================== */

export const connectSocket = () => {
  if (!socket.connected) {
    socket.auth = { token: getToken() };  // refresh token before connect
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

/* ===============================
   Dev Debug Logs
=============================== */

if (import.meta.env.DEV) {
  socket.on("connect", () => {
    console.log("Socket Connected:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket Disconnected:", reason);
  });

  socket.on("connect_error", (err) => {
    console.error("Socket Connection Error:", err.message);
  });
}

export default socket;