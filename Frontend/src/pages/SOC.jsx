import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import "./SOC.css";

export default function SOC() {
  const [processStage, setProcessStage] = useState("idle");
  const [systemStatus, setSystemStatus] = useState("Monitoring");
  const [threatLevel, setThreatLevel] = useState("Low");

  const socketRef = useRef(null);

  /* ================= SOCKET CONNECT ================= */
  useEffect(() => {
    socketRef.current = io("http://localhost:5000", {
      auth: { token: localStorage.getItem("token") },
      transports: ["websocket"],
    });

    const socket = socketRef.current;

    socket.on("attack:recon", () => {
      setProcessStage("recon");
      setSystemStatus("Recon Activity Detected");
      setThreatLevel("Medium");
    });

    socket.on("attack:escalation", () => {
      setProcessStage("escalation");
      setSystemStatus("Exploit Attempt In Progress");
      setThreatLevel("High");
    });

    socket.on("attack:critical", () => {
      setProcessStage("critical");
      setSystemStatus("System Compromised");
      setThreatLevel("Critical");
    });

    socket.on("attack:mitigated", () => {
      setProcessStage("completed");
      setSystemStatus("Threat Neutralized");
      setThreatLevel("Low");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className={`soc-container ${processStage}`}>
      <div className="soc-card">

        <h1 className="soc-title">Security Operations Center</h1>

        {/* STATUS PANEL */}
        <div className="soc-status-panel">
          <div className="soc-stat">
            <span>System Status</span>
            <strong>{systemStatus}</strong>
          </div>

          <div className={`soc-threat ${threatLevel.toLowerCase()}`}>
            <span>Threat Level</span>
            <strong>{threatLevel}</strong>
          </div>
        </div>

        {/* PROCESS TIMELINE */}
        <div className="process-container">
          {[
            { key: "recon", label: "Reconnaissance" },
            { key: "escalation", label: "Escalation" },
            { key: "critical", label: "Critical Breach" },
            { key: "completed", label: "Mitigation Complete" },
          ].map((step, index) => (
            <div
              key={step.key}
              className={`process-row
                ${processStage === step.key ? "active" : ""}
                ${
                  ["recon", "escalation", "critical", "completed"].indexOf(
                    processStage
                  ) > index
                    ? "done"
                    : ""
                }`}
            >
              <div className="step-indicator">
                <span>{index + 1}</span>
              </div>
              <span className="step-title">{step.label}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}