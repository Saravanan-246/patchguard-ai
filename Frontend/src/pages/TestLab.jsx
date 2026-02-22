// 🛡️ PATCHGUARD AI - INCIDENT RESPONSE CENTER v4.1
// Seeded Data | Persistent | Auto Workflow | Enterprise Demo Ready

import React, { useState, useEffect, useCallback } from "react";
import { ShieldAlert, Zap, User, Clock } from "lucide-react";
import "./TestLab.css";

const SYSTEMS = [
  "Web-Server-01",
  "DB-Server-02",
  "Mail-Server-03",
  "API-Gateway-01",
  "Firewall-01",
];

const ISSUES = [
  { name: "Port Scan Detected", severity: "Medium" },
  { name: "Brute Force Login Attempt", severity: "High" },
  { name: "Privilege Escalation", severity: "High" },
  { name: "Virus Infection Detected", severity: "Critical" },
  { name: "Unauthorized Hacker Intrusion", severity: "Critical" },
];

const WORKFLOW = ["Open", "Investigating", "Contained", "Mitigated", "Resolved"];

const STORAGE_KEY = "patchguard_incidents";

/* =========================
   STATIC SEED DATA
========================= */
const STATIC_INCIDENTS = [
  {
    id: "INC-10001",
    system: "Web-Server-01",
    type: "Port Scan Detected",
    severity: "Medium",
    status: "Investigating",
    riskScore: 72,
    assignedTo: "AI Defense Engine",
    createdAt: new Date().toISOString(),
  },
  {
    id: "INC-10002",
    system: "Firewall-01",
    type: "Unauthorized Hacker Intrusion",
    severity: "Critical",
    status: "Contained",
    riskScore: 94,
    assignedTo: "AI Defense Engine",
    createdAt: new Date().toISOString(),
  },
];

const TestLab = () => {
  const [selectedSystem, setSelectedSystem] = useState(SYSTEMS[0]);
  const [selectedIssue, setSelectedIssue] = useState(ISSUES[0]);
  const [incidents, setIncidents] = useState([]);
  const [banner, setBanner] = useState("Ready for Security Testing");

  /* =========================
     LOAD FROM STORAGE OR SEED
  ========================= */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        setIncidents(JSON.parse(saved));
      } catch {
        setIncidents(STATIC_INCIDENTS);
      }
    } else {
      setIncidents(STATIC_INCIDENTS);
    }
  }, []);

  /* =========================
     SAVE TO STORAGE
  ========================= */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(incidents));
  }, [incidents]);

  /* =========================
     AUTO WORKFLOW ENGINE
  ========================= */
  useEffect(() => {
    const active = incidents.find((i) => i.status !== "Resolved");
    if (!active) return;

    const currentIndex = WORKFLOW.indexOf(active.status);
    if (currentIndex === -1) return;

    if (currentIndex < WORKFLOW.length - 1) {
      const timer = setTimeout(() => {
        const nextStatus = WORKFLOW[currentIndex + 1];

        setIncidents((prev) =>
          prev.map((inc) =>
            inc.id === active.id ? { ...inc, status: nextStatus } : inc
          )
        );

        setBanner(`AI Processing → ${nextStatus}`);
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setBanner("All Threats Neutralized");
    }
  }, [incidents]);

  /* =========================
     RUN SECURITY TEST
  ========================= */
  const runSecurityTest = useCallback(() => {
    const id = `INC-${Date.now()}`;

    const newIncident = {
      id,
      system: selectedSystem,
      type: selectedIssue.name,
      severity: selectedIssue.severity,
      status: "Open",
      riskScore: Math.floor(Math.random() * 40) + 60,
      assignedTo: "AI Defense Engine",
      createdAt: new Date().toISOString(),
    };

    setIncidents((prev) => [newIncident, ...prev]);
    setBanner(`Security Test Triggered → ${id}`);
  }, [selectedSystem, selectedIssue]);

  /* =========================
     CLEAR ALL DATA
  ========================= */
  const clearIncidents = () => {
    setIncidents(STATIC_INCIDENTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(STATIC_INCIDENTS));
    setBanner("System Reset to Default State");
  };

  /* =========================
     BADGE RENDER
  ========================= */
  const renderBadge = (type, value) => (
    <span className={`${type}-badge ${type}-${value.toLowerCase()}`}>
      {value}
    </span>
  );

  return (
    <div className="incident-center">
      <header className="center-header">
        <h1 className="center-title">
          <ShieldAlert /> Incident Response Center
        </h1>
        <div className="status-banner active">{banner}</div>
      </header>

      {/* Creator */}
      <section className="creator-section">
        <div className="creator-card">
          <div className="form-group">
            <label>Target System</label>
            <select
              value={selectedSystem}
              onChange={(e) => setSelectedSystem(e.target.value)}
            >
              {SYSTEMS.map((sys) => (
                <option key={sys}>{sys}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Test Scenario</label>
            <select
              value={selectedIssue.name}
              onChange={(e) =>
                setSelectedIssue(
                  ISSUES.find((i) => i.name === e.target.value)
                )
              }
            >
              {ISSUES.map((issue) => (
                <option key={issue.name}>{issue.name}</option>
              ))}
            </select>
          </div>

          <button className="create-btn" onClick={runSecurityTest}>
            <Zap size={18} />
            Run Security Test
          </button>

          <button className="clear-btn" onClick={clearIncidents}>
            Reset System
          </button>
        </div>
      </section>

      {/* Table */}
      <section className="table-section">
        <div className="table-header">
          <div>ID</div>
          <div>System</div>
          <div>Type</div>
          <div>Severity</div>
          <div>Status</div>
          <div>Risk</div>
          <div>Assigned</div>
          <div>Created</div>
        </div>

        <div className="table-body">
          {incidents.map((inc) => (
            <div key={inc.id} className="table-row">
              <div>{inc.id}</div>
              <div>{inc.system}</div>
              <div>{inc.type}</div>
              <div>{renderBadge("severity", inc.severity)}</div>
              <div>{renderBadge("status", inc.status)}</div>
              <div>{inc.riskScore}</div>
              <div>
                <User size={14} /> {inc.assignedTo}
              </div>
              <div>
                <Clock size={14} />
                {new Date(inc.createdAt).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TestLab;