import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import "./AuditLogs.css";

const STATUS_COLORS = {
  success: "success",
  warning: "warning",
  info: "info",
  error: "error",
};

const AuditLogs = () => {
  const [search, setSearch] = useState("");

  const logs = [
    { id: 1, time: "10:42 AM", date: "Feb 21, 2026", event: "Patch deployed", system: "Prod-API-01", status: "Success" },
    { id: 2, time: "09:18 AM", date: "Feb 21, 2026", event: "Login attempt failed", system: "Admin Panel", status: "Warning" },
    { id: 3, time: "08:55 AM", date: "Feb 21, 2026", event: "Compliance report generated", system: "Compliance Engine", status: "Info" },
    { id: 4, time: "07:30 AM", date: "Feb 21, 2026", event: "System scan completed", system: "Web-Node-07", status: "Success" },
  ];

  const filteredLogs = useMemo(() => {
    return logs.filter(
      (log) =>
        log.event.toLowerCase().includes(search.toLowerCase()) ||
        log.system.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const statusSummary = useMemo(() => {
    return logs.reduce(
      (acc, log) => {
        const key = log.status.toLowerCase();
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      {}
    );
  }, []);

  return (
    <div className="audit-page">
      <div className="audit-container">

        {/* Header */}
        <div className="audit-header">
          <h1>Audit Logs</h1>
          <p>Security event tracking & compliance monitoring</p>
        </div>

        {/* Summary Cards */}
        <div className="audit-summary">
          <div className="summary-card success">
            <h3>{statusSummary.success || 0}</h3>
            <p>Successful Events</p>
          </div>
          <div className="summary-card warning">
            <h3>{statusSummary.warning || 0}</h3>
            <p>Warnings</p>
          </div>
          <div className="summary-card info">
            <h3>{statusSummary.info || 0}</h3>
            <p>Informational</p>
          </div>
        </div>

        {/* Search */}
        <div className="audit-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by event or system..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="audit-table-wrapper">
          <table className="audit-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Event</th>
                <th>System</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td className="date">{log.date}</td>
                  <td className="time">{log.time}</td>
                  <td>{log.event}</td>
                  <td className="system">{log.system}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        STATUS_COLORS[log.status.toLowerCase()]
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLogs.length === 0 && (
            <div className="no-results">
              🔍 No matching logs found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;