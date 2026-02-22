import React, { useState, useMemo } from "react";
import {
  Search,
  Download,
  ExternalLink,
  Package,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Button } from "../components/ui";
import "./Vulnerabilities.css";

const initialData = [
  {
    id: 1,
    cveId: "CVE-2024-21413",
    title: "Microsoft Outlook Remote Code Execution",
    severity: "Critical",
    cvssScore: 9.8,
    affectedSystems: 12,
    status: "Open",
    detectedDate: "2024-02-21",
  },
  {
    id: 2,
    cveId: "CVE-2024-20667",
    title: "Windows Kernel Privilege Escalation",
    severity: "High",
    cvssScore: 8.5,
    affectedSystems: 8,
    status: "In Progress",
    detectedDate: "2024-02-20",
  },
];

const Vulnerabilities = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [vulnerabilities, setVulnerabilities] = useState(initialData);

  /* ================= FILTER ================= */

  const filteredVulnerabilities = useMemo(() => {
    return vulnerabilities.filter((v) => {
      const matchesSearch =
        v.cveId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.title.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSeverity =
        severityFilter === "All" || v.severity === severityFilter;

      return matchesSearch && matchesSeverity;
    });
  }, [searchTerm, severityFilter, vulnerabilities]);

  /* ================= ACTIONS ================= */

  const handleExport = () => {
    const csv = [
      ["CVE", "Title", "Severity", "CVSS", "Systems", "Status", "Date"],
      ...vulnerabilities.map((v) => [
        v.cveId,
        v.title,
        v.severity,
        v.cvssScore,
        v.affectedSystems,
        v.status,
        v.detectedDate,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "vulnerabilities.csv";
    link.click();
  };

  const handlePatch = (id) => {
    setVulnerabilities((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, status: "In Progress" } : v
      )
    );
  };

  const handleResolve = (id) => {
    setVulnerabilities((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, status: "Resolved" } : v
      )
    );
  };

  const handleView = (cveId) => {
    window.open(`https://nvd.nist.gov/vuln/detail/${cveId}`, "_blank");
  };

  /* ================= BADGES ================= */

  const SeverityBadge = ({ severity }) => (
    <span className={`severity-badge ${severity.toLowerCase()}`}>
      {severity}
    </span>
  );

  const StatusBadge = ({ status }) => {
    const iconMap = {
      Open: Clock,
      "In Progress": Package,
      Resolved: CheckCircle,
    };

    const Icon = iconMap[status] || Clock;

    return (
      <span className={`status-badge ${status.replace(" ", "-").toLowerCase()}`}>
        <Icon size={12} />
        {status}
      </span>
    );
  };

  /* ================= RENDER ================= */

  return (
    <div className="vuln-page">
      <div className="vuln-header">
        <div>
          <h1>Vulnerabilities</h1>
          <p>Monitor and manage detected security risks</p>
        </div>

        <div className="vuln-filters">
          <div className="search-box">
            <Search size={16} />
            <input
              placeholder="Search CVE or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <Button variant="secondary" size="small" onClick={handleExport}>
            <Download size={14} />
            Export
          </Button>
        </div>
      </div>

      <div className="vuln-table-wrapper">
        <table className="vuln-table">
          <thead>
            <tr>
              <th>CVE ID</th>
              <th>Title</th>
              <th>Severity</th>
              <th>CVSS</th>
              <th>Systems</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredVulnerabilities.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-state">
                  No vulnerabilities found.
                </td>
              </tr>
            ) : (
              filteredVulnerabilities.map((v) => (
                <tr key={v.id}>
                  <td className="cve-id">{v.cveId}</td>
                  <td>{v.title}</td>
                  <td>
                    <SeverityBadge severity={v.severity} />
                  </td>
                  <td>{v.cvssScore}</td>
                  <td>{v.affectedSystems}</td>
                  <td>
                    <StatusBadge status={v.status} />
                  </td>
                  <td>{v.detectedDate}</td>
                  <td className="actions">
                    <button
                      className="action-btn"
                      onClick={() => handleView(v.cveId)}
                    >
                      <ExternalLink size={14} />
                      View
                    </button>

                    {v.status !== "Resolved" && (
                      <>
                        <button
                          className="action-btn primary"
                          onClick={() => handlePatch(v.id)}
                        >
                          <Package size={14} />
                          Patch
                        </button>

                        <button
                          className="action-btn success"
                          onClick={() => handleResolve(v.id)}
                        >
                          <CheckCircle size={14} />
                          Resolve
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Vulnerabilities;