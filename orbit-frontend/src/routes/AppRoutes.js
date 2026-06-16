import { Navigate, Route, Routes } from "react-router-dom";

import LoginPage from "../pages/Auth/LoginPage";
import SignupPage from "../pages/Auth/SignupPage";

import DashboardPage from "../pages/Dashboard/DashboardPage";
import LeadsPage from "../pages/Leads/LeadsPage";

// ✅ NEW PAGES
import AgentsPage from "../pages/Agents/AgentsPage";
import ContactsPage from "../pages/Contacts/ContactsPage";
import ManagerPage from "../pages/Manager/ManagerPage";
import ReportsPage from "../pages/Reports/ReportsPage";

// A wrapper component for routes that require authentication
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/loginpage" replace />;
};

// A wrapper component for routes that should only be accessible when not logged in
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/dashboard" replace /> : children;
};

function AppRoutes() {
  return (
    <Routes>

      {/* DEFAULT ROUTE */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      {/* AUTH */}
      <Route
        path="/loginpage"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/signuppage"
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        }
      />

      {/* PROTECTED ROUTES */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/leads"
        element={
          <ProtectedRoute>
            <LeadsPage />
          </ProtectedRoute>
        }
      />

      {/* ✅ NEW ROUTES */}
      <Route
        path="/manager"
        element={
          <ProtectedRoute>
            <ManagerPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/agents"
        element={
          <ProtectedRoute>
            <AgentsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/contacts"
        element={
          <ProtectedRoute>
            <ContactsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/loginpage" />} />

    </Routes>
  );
}

export default AppRoutes;