import React, { useEffect, useState, useCallback } from "react";
import { CalendarClock, RefreshCw } from "lucide-react";
import api from "../services/api";

const PatchScheduler = () => {
  const [patches, setPatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ================= Fetch Patches ================= */

  const fetchPatches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get("/patches");

      const data =
        Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];

      setPatches(data);
    } catch (err) {
      console.error("❌ Fetch patches failed:", err);
      setError(err?.message || "Failed to load patch schedules.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatches();
  }, [fetchPatches]);

  /* ================= Status Styling ================= */

  const getStatusStyle = (status = "") => {
    const s = status.toLowerCase();

    if (s === "completed")
      return { bg: "#ecfdf5", color: "#065f46" };

    if (s === "scheduled")
      return { bg: "#eff6ff", color: "#1d4ed8" };

    if (s === "pending")
      return { bg: "#fef3c7", color: "#92400e" };

    return { bg: "#f3f4f6", color: "#374151" };
  };

  /* ================= Stats ================= */

  const stats = {
    scheduled: patches.filter(p => p.status?.toLowerCase() === "scheduled").length,
    pending: patches.filter(p => p.status?.toLowerCase() === "pending").length,
    completed: patches.filter(p => p.status?.toLowerCase() === "completed").length,
  };

  return (
    <div style={container}>
      <div style={wrapper}>

        {/* Header */}
        <div style={header}>
          <div>
            <h1 style={title}>Patch Scheduler</h1>
            <p style={subtitle}>
              Manage maintenance windows and track patch execution.
            </p>
          </div>

          <button style={refreshBtn} onClick={fetchPatches}>
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div style={statsGrid}>
          <StatCard label="Scheduled" value={stats.scheduled} />
          <StatCard label="Pending" value={stats.pending} />
          <StatCard label="Completed" value={stats.completed} />
        </div>

        {/* Table Card */}
        <div style={card}>
          <div style={cardHeader}>
            <CalendarClock size={18} />
            <h3 style={{ margin: 0 }}>Patch Windows</h3>
          </div>

          {loading && <p style={muted}>Loading patches...</p>}
          {error && <p style={errorText}>{error}</p>}
          {!loading && !error && patches.length === 0 && (
            <p style={muted}>No patch schedules available.</p>
          )}

          {!loading && !error && patches.length > 0 && (
            <div style={tableWrapper}>
              <table style={table}>
                <thead style={thead}>
                  <tr>
                    <th style={th}>System</th>
                    <th style={th}>Maintenance Window</th>
                    <th style={th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {patches.map((patch) => {
                    const statusStyle = getStatusStyle(patch.status);
                    return (
                      <tr key={patch._id} style={tr}>
                        <td style={tdStrong}>
                          {patch.systemName || "N/A"}
                        </td>
                        <td style={tdMuted}>
                          {patch.window || "Not scheduled"}
                        </td>
                        <td style={td}>
                          <span
                            style={{
                              ...badge,
                              background: statusStyle.bg,
                              color: statusStyle.color,
                            }}
                          >
                            {patch.status || "Unknown"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ================= Reusable Stat Card ================= */

const StatCard = ({ label, value }) => (
  <div style={statCard}>
    <p style={statLabel}>{label}</p>
    <p style={statValue}>{value}</p>
  </div>
);

/* ================= Styles ================= */

const container = {
  background: "#f8fafc",
  minHeight: "100%",
  padding: "32px",
};

const wrapper = {
  maxWidth: "1100px",
  margin: "0 auto",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "28px",
};

const title = {
  fontSize: "24px",
  fontWeight: 600,
  margin: 0,
};

const subtitle = {
  fontSize: "14px",
  color: "#6b7280",
};

const refreshBtn = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  padding: "8px 14px",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
  background: "#ffffff",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: 500,
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "16px",
  marginBottom: "24px",
};

const statCard = {
  background: "#ffffff",
  padding: "18px",
  borderRadius: "12px",
  border: "1px solid #f1f5f9",
};

const statLabel = {
  fontSize: "13px",
  color: "#6b7280",
  marginBottom: "6px",
};

const statValue = {
  fontSize: "20px",
  fontWeight: 600,
  margin: 0,
};

const card = {
  background: "#ffffff",
  borderRadius: "12px",
  padding: "20px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
};

const cardHeader = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "16px",
};

const tableWrapper = {
  overflowX: "auto",
  overflowY: "auto",
  maxHeight: "420px",
  border: "1px solid #f1f5f9",
  borderRadius: "12px",
  scrollBehavior: "smooth",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "14px",
};

const thead = {
  background: "#f9fafb",
  position: "sticky",
  top: 0,
  zIndex: 5,
};

const th = {
  padding: "12px",
  textAlign: "left",
  fontWeight: 600,
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  color: "#374151",
  borderBottom: "1px solid #e5e7eb",
};

const tr = {
  borderBottom: "1px solid #f3f4f6",
};

const td = {
  padding: "12px",
};

const tdStrong = {
  ...td,
  fontWeight: 500,
};

const tdMuted = {
  ...td,
  color: "#6b7280",
};

const badge = {
  padding: "4px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: 500,
  textTransform: "capitalize",
};

const muted = {
  color: "#6b7280",
};

const errorText = {
  color: "#dc2626",
  fontSize: "14px",
};

export default PatchScheduler;