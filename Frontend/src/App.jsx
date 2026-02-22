import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TestLab from "./pages/TestLab"; // ✅ NEW PAGE
import Vulnerabilities from "./pages/Vulnerabilities";
import Systems from "./pages/Systems";
import PatchScheduler from "./pages/PatchScheduler";
import Compliance from "./pages/Compliance";
import AuditLogs from "./pages/AuditLogs";
import SettingsPage from "./pages/Settings";

function App() {
  return (
    <Router>
      <Routes>

        {/* ================= PUBLIC ROUTE ================= */}
        <Route path="/login" element={<Login />} />

        {/* ================= PROTECTED ROUTES ================= */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Default redirect */}
          <Route index element={<Navigate to="dashboard" replace />} />

          {/* Core Pages */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="test-lab" element={<TestLab />} /> {/* ✅ Added */}
          <Route path="vulnerabilities" element={<Vulnerabilities />} />
          <Route path="systems" element={<Systems />} />
          <Route path="patch-scheduler" element={<PatchScheduler />} />
          <Route path="compliance" element={<Compliance />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Catch All (Optional but Professional) */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </Router>
  );
}

export default App;