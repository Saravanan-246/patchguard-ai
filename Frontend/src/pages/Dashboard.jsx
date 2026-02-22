// 🚀 PATCHGUARD AI - CLEAN PROFESSIONAL DASHBOARD
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Monitor,
  Shield,
  Clock,
  CheckCircle,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { Button } from "../components/ui";
import socket from "../services/socket";
import "./Dashboard.css";

const COLORS = {
  Critical: "#dc2626",
  High: "#f59e0b",
  Medium: "#3b82f6",
  Low: "#10b981"
};

const Dashboard = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  const [riskData, setRiskData] = useState([
    { name: "Critical", value: 45 },
    { name: "High", value: 120 },
    { name: "Medium", value: 300 },
    { name: "Low", value: 450 }
  ]);

  const [activities] = useState([
    { text: "Patch applied successfully", type: "success", time: "2m ago" },
    { text: "Critical CVE detected", type: "critical", time: "5m ago" },
    { text: "System scan completed", type: "success", time: "12m ago" }
  ]);

  /* ---------------- SOCKET ---------------- */
  useEffect(() => {
    const updateTime = () => setLastUpdated(new Date());

    socket.on("risk:updated", updateTime);
    socket.on("threat:detected", updateTime);

    return () => {
      socket.off("risk:updated", updateTime);
      socket.off("threat:detected", updateTime);
    };
  }, []);

  /* ---------------- REFRESH ---------------- */
  const handleRefresh = useCallback(() => {
    if (refreshing) return;
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setLastUpdated(new Date());
    }, 1000);
  }, [refreshing]);

  /* ---------------- DERIVED DATA ---------------- */
  const totalThreats = useMemo(
    () => riskData.reduce((sum, d) => sum + d.value, 0),
    [riskData]
  );

  const criticalCount = useMemo(
    () =>
      riskData.find(d => d.name === "Critical")?.value?.toLocaleString() || 0,
    [riskData]
  );

  const kpis = [
    { title: "Assets", value: "2,847", trend: "up", icon: Monitor },
    { title: "Critical", value: criticalCount, trend: "up", icon: AlertCircle },
    { title: "Compliance", value: "78%", trend: "down", icon: Shield },
    { title: "MTTR", value: "4.2h", trend: "down", icon: Clock }
  ];

  return (
    <div className="cyber-dashboard">
      {/* HEADER */}
      <header className="cyber-header">
        <div>
          <h1>PatchGuard AI</h1>
          <p>Cyber Threat Intelligence Center</p>
        </div>

        <div className="header-right">
          <div className="live-status">
            <span className="live-dot" />
            Live Monitoring • {lastUpdated.toLocaleTimeString()}
          </div>

          <Button onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw size={18} className={refreshing ? "spin mr-2" : "mr-2"} />
            {refreshing ? "Syncing..." : "Sync"}
          </Button>
        </div>
      </header>

      {/* MAIN */}
      <main className="main-content">
        {/* KPI GRID */}
        <section className="mission-grid">
          {kpis.map(kpi => (
            <article key={kpi.title} className="mission-card">
              <div className="metric-header">
                <div>
                  <p className="metric-label">{kpi.title}</p>
                  <div className="metric-value">{kpi.value}</div>
                  <div className={`metric-trend ${kpi.trend}`}>
                    {kpi.trend === "up" ? (
                      <TrendingUp size={16} />
                    ) : (
                      <TrendingDown size={16} />
                    )}
                    <span>{kpi.trend === "up" ? "+8%" : "-3%"}</span>
                  </div>
                </div>
                <div className="metric-icon">
                  <kpi.icon size={22} />
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* GRID */}
        <section className="threat-center-grid">
          {/* DEFENSE STATUS */}
          <article className="cyber-card">
            <header className="card-header">
              <h2>Defense Engine</h2>
            </header>

            <div className="engine-status">
              <h3>System Secure</h3>
              <p>All services operational. No active breach detected.</p>
            </div>

            <div className="engine-stats">
              <div>
                <span>Threat Level</span>
                <strong>Low</strong>
              </div>
              <div>
                <span>Last Scan</span>
                <strong>{lastUpdated.toLocaleTimeString()}</strong>
              </div>
            </div>
          </article>

          {/* RISK RADAR */}
          <article className="cyber-card">
            <header className="card-header">
              <h2>Risk Radar</h2>
              <p>Total Threat Distribution</p>
            </header>

            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={riskData}
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    paddingAngle={3}
                  >
                    {riskData.map((d, i) => (
                      <Cell key={i} fill={COLORS[d.name]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="radar-center">
                <h3>{totalThreats}</h3>
                <span>Threats</span>
              </div>
            </div>
          </article>

          {/* INCIDENTS */}
          <article className="cyber-card">
            <h2>Recent Incidents</h2>

            <div className="incidents-list">
              {activities.map((a, i) => (
                <div key={i} className={`incident ${a.type}`}>
                  {a.type === "success" ? (
                    <CheckCircle size={16} />
                  ) : (
                    <AlertCircle size={16} />
                  )}
                  <div>
                    <p>{a.text}</p>
                    <span>{a.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;