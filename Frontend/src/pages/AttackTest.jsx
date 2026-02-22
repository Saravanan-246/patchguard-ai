import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import "./AttackTest.css";

export default function AttackTest() {
  const [logs, setLogs] = useState([]);
  const [systemId, setSystemId] = useState("");
  const [loading, setLoading] = useState(false);

  const socketRef = useRef(null);
  const logEndRef = useRef(null);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  /* ================= SOCKET CONNECT ================= */
  useEffect(() => {
    socketRef.current = io("http://localhost:5000", {
      auth: { token: localStorage.getItem("token") },
      transports: ["websocket"],
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  /* ================= STRONG ATTACK FLOW ================= */
  const startAttack = async () => {
    if (!systemId || !socketRef.current) return;

    const socket = socketRef.current;
    setLoading(true);

    try {
      // Optional backend trigger
      await axios.post(`/api/simulate-attack/${systemId}`);
    } catch {
      // Even if backend fails, we continue simulation
    }

    // Stage 1 – Recon
    socket.emit("attack:recon", { systemId });
    setLogs((prev) => [
      {
        type: "info",
        text: "External reconnaissance detected from unknown IP",
        time: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);

    await new Promise((res) => setTimeout(res, 1200));

    // Stage 2 – Escalation
    socket.emit("attack:escalation", { systemId });
    setLogs((prev) => [
      {
        type: "warning",
        text: "Exploit attempt targeting API gateway",
        time: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);

    await new Promise((res) => setTimeout(res, 1500));

    // Stage 3 – Critical Breach
    socket.emit("attack:critical", { systemId });
    setLogs((prev) => [
      {
        type: "critical",
        text: "Privilege escalation successful – system compromised",
        time: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);

    setLoading(false);
  };

  const clearLogs = () => setLogs([]);

  return (
    <div className="attack-container">
      <div className="attack-card">
        <h1 className="attack-title">Red Team Simulation Console</h1>

        <div className="top-controls">
          <input
            className="attack-input"
            placeholder="Enter System ID"
            value={systemId}
            onChange={(e) => setSystemId(e.target.value)}
          />

          <button
            className="attack-button"
            onClick={startAttack}
            disabled={loading}
          >
            {loading ? "Simulating..." : "Launch Attack"}
          </button>

          <button className="clear-button" onClick={clearLogs}>
            Clear
          </button>
        </div>

        <div className="log-panel">
          <h2>Live Attack Feed</h2>

          <div className="log-list">
            {logs.map((log, index) => (
              <div key={index} className={`log-item ${log.type}`}>
                <span className="log-time">[{log.time}]</span>
                <span className="log-text">{log.text}</span>
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}