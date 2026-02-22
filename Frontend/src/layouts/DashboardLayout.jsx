import React, { useState, useEffect, useMemo, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Shield,
  Server,
  Calendar,
  FileCheck,
  FileText,
  Settings,
  Bell,
  Menu,
  ChevronLeft,
  LogOut,
  LogIn,
  FlaskConical,
  X
} from "lucide-react";
import "./DashboardLayout.css";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const notificationRef = useRef(null);

  /* ================= Notifications Mock ================= */

  const [notifications, setNotifications] = useState([
    { id: 1, text: "New Critical Incident Created", time: "2m ago" },
    { id: 2, text: "Firewall Policy Updated", time: "10m ago" },
    { id: 3, text: "System Scan Completed", time: "30m ago" }
  ]);

  const unreadCount = notifications.length;

  /* ================= Responsive ================= */

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else {
        setMobileOpen(false);
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  /* ================= Close Notification on Outside Click ================= */

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) setMobileOpen((prev) => !prev);
    else setSidebarOpen((prev) => !prev);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const handleLogin = () => navigate("/login");

  /* ================= MENU ================= */

  const menuItems = useMemo(() => [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: FlaskConical, label: "Test Lab", path: "/test-lab" },
    { icon: Shield, label: "Vulnerabilities", path: "/vulnerabilities" },
    { icon: Server, label: "Systems", path: "/systems" },
    { icon: Calendar, label: "Patch Scheduler", path: "/patch-scheduler" },
    { icon: FileCheck, label: "Compliance", path: "/compliance" },
    { icon: FileText, label: "Audit Logs", path: "/audit-logs" },
    { icon: Settings, label: "Settings", path: "/settings" }
  ], []);

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const isExpanded = isMobile ? mobileOpen : sidebarOpen;

  return (
    <div className="layout">
      {isMobile && mobileOpen && (
        <div className="overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`sidebar 
          ${isMobile ? "mobile" : "desktop"} 
          ${isExpanded ? "open" : "collapsed"} 
          ${mobileOpen ? "show" : ""}`}
      >
        <div className="logo" onClick={() => navigate("/dashboard")}>
          <Shield size={22} />
          {isExpanded && <span>PatchGuard AI</span>}
        </div>

        <nav className="menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.path}
                className={`menu-item ${isActive(item.path) ? "active" : ""}`}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setMobileOpen(false);
                }}
              >
                <Icon size={20} />
                {isExpanded && <span>{item.label}</span>}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* ================= MAIN ================= */}
      <div className="main">
        <header className="navbar">
          <button className="icon-btn toggle-btn" onClick={toggleSidebar}>
            {isExpanded ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>

          <div className="navbar-right">

            {/* Notifications */}
            <div className="notifications" ref={notificationRef}>
              <button
                className="icon-btn"
                onClick={() => setShowNotifications((prev) => !prev)}
              >
                <Bell size={20} />
              </button>

              {unreadCount > 0 && (
                <span className="notification-badge">
                  {unreadCount}
                </span>
              )}

              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="dropdown-header">
                    <h4>Notifications</h4>
                    <button onClick={() => setNotifications([])}>
                      Clear All
                    </button>
                  </div>

                  {notifications.length === 0 ? (
                    <p className="empty">No new notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className="notification-item">
                        <p>{n.text}</p>
                        <span>{n.time}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Auth */}
            {token ? (
              <button
                className="auth-btn logout"
                onClick={() => setShowLogoutModal(true)}
              >
                <LogOut size={18} />
                {isExpanded && <span>Logout</span>}
              </button>
            ) : (
              <button className="auth-btn login" onClick={handleLogin}>
                <LogIn size={18} />
                {isExpanded && <span>Login</span>}
              </button>
            )}
          </div>
        </header>

        <main className="content">
          <Outlet />
        </main>
      </div>

      {/* ================= LOGOUT CONFIRM MODAL ================= */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="logout-modal">
            <div className="modal-header">
              <h3>Confirm Logout</h3>
              <button onClick={() => setShowLogoutModal(false)}>
                <X size={18} />
              </button>
            </div>

            <p>Are you sure you want to logout from PatchGuard AI?</p>

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>

              <button
                className="confirm-btn"
                onClick={confirmLogout}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;