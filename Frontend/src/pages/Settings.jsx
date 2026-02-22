import React, { useState, useEffect } from "react";
import {
  Shield,
  Users,
  Bell,
  Settings,
  ArrowRight,
  X,
} from "lucide-react";
import "./SettingsPage.css";

const STORAGE_KEY = "patchguard_settings";

const defaultSettings = {
  users: {
    allowRegistration: true,
  },
  security: {
    enforce2FA: false,
    passwordLength: 8,
  },
  notifications: {
    emailAlerts: true,
    smsAlerts: false,
  },
  system: {
    darkMode: false,
  },
};

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [settings, setSettings] = useState(defaultSettings);

  /* ================= LOAD SETTINGS ================= */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  /* ================= SAVE SETTINGS ================= */
  const saveSettings = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setActiveSection(null);
  };

  const sections = [
    { key: "users", title: "User Management", icon: Users, accent: "blue" },
    { key: "security", title: "Security Policies", icon: Shield, accent: "red" },
    { key: "notifications", title: "Notification Settings", icon: Bell, accent: "yellow" },
    { key: "system", title: "System Preferences", icon: Settings, accent: "purple" },
  ];

  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <h1>Settings</h1>
          <p>System configuration and administrative preferences</p>
        </div>

        {/* Cards */}
        <div className="settings-grid">
          {sections.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                className={`settings-card ${item.accent}`}
              >
                <div className="card-top">
                  <div className="icon-box">
                    <Icon size={18} />
                  </div>
                </div>

                <h3>{item.title}</h3>

                <button
                  className="settings-btn"
                  onClick={() => setActiveSection(item.key)}
                >
                  Open Settings
                  <ArrowRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {activeSection && (
        <div className="modal-overlay">
          <div className="settings-modal">
            <div className="modal-header">
              <h3>{activeSection.toUpperCase()} SETTINGS</h3>
              <button onClick={() => setActiveSection(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">

              {/* USERS */}
              {activeSection === "users" && (
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.users.allowRegistration}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          users: {
                            ...settings.users,
                            allowRegistration: e.target.checked,
                          },
                        })
                      }
                    />
                    Allow User Self Registration
                  </label>
                </div>
              )}

              {/* SECURITY */}
              {activeSection === "security" && (
                <>
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={settings.security.enforce2FA}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            security: {
                              ...settings.security,
                              enforce2FA: e.target.checked,
                            },
                          })
                        }
                      />
                      Enforce Two-Factor Authentication
                    </label>
                  </div>

                  <div className="form-group">
                    <label>Password Minimum Length</label>
                    <input
                      type="number"
                      value={settings.security.passwordLength}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          security: {
                            ...settings.security,
                            passwordLength: Number(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                </>
              )}

              {/* NOTIFICATIONS */}
              {activeSection === "notifications" && (
                <>
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={settings.notifications.emailAlerts}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            notifications: {
                              ...settings.notifications,
                              emailAlerts: e.target.checked,
                            },
                          })
                        }
                      />
                      Enable Email Alerts
                    </label>
                  </div>

                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={settings.notifications.smsAlerts}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            notifications: {
                              ...settings.notifications,
                              smsAlerts: e.target.checked,
                            },
                          })
                        }
                      />
                      Enable SMS Alerts
                    </label>
                  </div>
                </>
              )}

              {/* SYSTEM */}
              {activeSection === "system" && (
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.system.darkMode}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          system: {
                            ...settings.system,
                            darkMode: e.target.checked,
                          },
                        })
                      }
                    />
                    Enable Dark Mode
                  </label>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setActiveSection(null)}
              >
                Cancel
              </button>
              <button className="save-btn" onClick={saveSettings}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;