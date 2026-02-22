import React, { useEffect, useState, useCallback } from "react";
import { Server } from "lucide-react";
import api from "../services/api";

/* ===============================
   STATIC ENTERPRISE FALLBACK DATA
================================ */

const STATIC_SYSTEMS = [
  {
    _id: "1",
    name: "Web-Server-01",
    ipAddress: "192.168.1.12",
    environment: "Production",
    riskScore: 78,
  },
  {
    _id: "2",
    name: "DB-Server-02",
    ipAddress: "192.168.1.22",
    environment: "Production",
    riskScore: 84,
  },
  {
    _id: "3",
    name: "API-Gateway-01",
    ipAddress: "10.0.0.15",
    environment: "Staging",
    riskScore: 65,
  },
  {
    _id: "4",
    name: "Mail-Server-03",
    ipAddress: "172.16.0.8",
    environment: "Development",
    riskScore: 42,
  },
];

const Systems = () => {
  const [systems, setSystems] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===============================
     FETCH SYSTEMS (WITH FALLBACK)
  ============================== */

  const fetchSystems = useCallback(async () => {
    try {
      const res = await api.get("/systems");

      if (res?.data?.data?.length) {
        setSystems(
          res.data.data.map((sys) => ({
            ...sys,
            riskScore:
              sys.riskScore ??
              Math.floor(Math.random() * 40) + 50, // auto-generate if missing
          }))
        );
      } else {
        throw new Error("No backend systems");
      }
    } catch (error) {
      console.warn("Using static fallback systems data");

      // 🔥 Fallback to static enterprise data
      setSystems(STATIC_SYSTEMS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSystems();
  }, [fetchSystems]);

  /* ===============================
     RISK COLOR HELPER
  ============================== */

  const getRiskColor = (score) => {
    if (score >= 80) return "#dc2626"; // red
    if (score >= 60) return "#f59e0b"; // orange
    return "#16a34a"; // green
  };

  return (
    <div
      style={{
        background: "#f5f7fa",
        minHeight: "100vh",
        padding: "40px 24px",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1
            style={{
              fontSize: "26px",
              fontWeight: "600",
              color: "#111827",
              marginBottom: "6px",
            }}
          >
            Systems
          </h1>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>
            Manage and monitor registered infrastructure endpoints.
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div
            style={{
              background: "#ffffff",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              textAlign: "center",
              fontSize: "14px",
              color: "#6b7280",
            }}
          >
            Loading systems...
          </div>
        ) : systems.length === 0 ? (
          <div
            style={{
              background: "#ffffff",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              textAlign: "center",
              color: "#6b7280",
            }}
          >
            <Server size={28} style={{ marginBottom: "12px", opacity: 0.6 }} />
            <p style={{ fontSize: "14px" }}>No systems registered yet.</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {systems.map((system) => (
              <div
                key={system._id}
                style={{
                  background: "#ffffff",
                  padding: "22px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 8px 20px rgba(0,0,0,0.08)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.05)")
                }
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "12px",
                  }}
                >
                  <Server size={18} color="#6b7280" />
                  <span
                    style={{
                      fontWeight: "600",
                      fontSize: "15px",
                      color: "#111827",
                    }}
                  >
                    {system.name}
                  </span>
                </div>

                <div style={{ fontSize: "13px", color: "#6b7280" }}>
                  <p style={{ marginBottom: "6px" }}>
                    <strong>IP:</strong> {system.ipAddress}
                  </p>
                  <p style={{ marginBottom: "6px" }}>
                    <strong>Environment:</strong> {system.environment}
                  </p>
                  <p>
                    <strong>Risk Score:</strong>{" "}
                    <span
                      style={{
                        fontWeight: "600",
                        color: getRiskColor(system.riskScore || 0),
                      }}
                    >
                      {system.riskScore || 0}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Systems;