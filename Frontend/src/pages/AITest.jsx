import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import "./AITest.css";

export default function AITest() {
  const [systemId, setSystemId] = useState("");
  const [riskScore, setRiskScore] = useState(10);
  const [status, setStatus] = useState("Secure");
  const [defending, setDefending] = useState(false);

  const socketRef = useRef(null);

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

  /* ================= LISTEN TO ATTACK ================= */
  useEffect(() => {
    if (!socketRef.current) return;

    const socket = socketRef.current;

    socket.on("attack:recon", () => {
      setStatus("Recon Detected");
      setRiskScore((prev) => prev + 15);
    });

    socket.on("attack:escalation", () => {
      setStatus("Exploit Attempt");
      setRiskScore((prev) => prev + 25);
    });

    socket.on("attack:critical", () => {
      setStatus("System Compromised");
      setRiskScore(90);
    });

    return () => {
      socket.off("attack:recon");
      socket.off("attack:escalation");
      socket.off("attack:critical");
    };
  }, []);

  /* ================= AI MITIGATION ================= */
  const runMitigation = async () => {
    if (!systemId || defending || !socketRef.current) return;

    const socket = socketRef.current;
    setDefending(true);
    setStatus("AI Containment Active");

    try {
      await axios.post("/api/ai/simulate-attack", {
        systemId,
        intensity: "critical",
      });
    } catch {
      // even if backend fails, we simulate mitigation
    }

    // Fake AI processing delay
    setTimeout(() => {
      setRiskScore(10);
      setStatus("Secure");
      socket.emit("attack:mitigated", { systemId });
      setDefending(false);
    }, 1800);
  };

  return (
    <div className="ai-container">
      <div className="ai-card">
        <h1 className="ai-title">AI Defense Engine</h1>

        <input
          className="ai-input"
          placeholder="Enter System ID"
          value={systemId}
          onChange={(e) => setSystemId(e.target.value)}
        />

        <div className="ai-status-box">
          <div className="ai-stat">
            <span>Risk Score</span>
            <strong
              className={
                riskScore > 70
                  ? "high"
                  : riskScore > 30
                  ? "medium"
                  : "low"
              }
            >
              {riskScore}
            </strong>
          </div>

          <div className="ai-stat">
            <span>Status</span>
            <strong>{status}</strong>
          </div>
        </div>

        <button
          className={`ai-button ${defending ? "processing" : ""}`}
          onClick={runMitigation}
          disabled={defending}
        >
          {defending ? "AI Processing..." : "Run AI Mitigation"}
        </button>
      </div>
    </div>
  );
}