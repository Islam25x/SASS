import { Navigate, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import SupportPage from "./pages/SupportPage";
import AIPage from "./pages/AIPage";
import ProfilePage from "./pages/ProfilePage";
import WelcomePage from "./pages/WelcomePage";
import CheckEmailPage from "./pages/CheckEmailPage";
import ConfirmEmailPage from "./pages/ConfirmEmailPage";
import ProtectedRoute from "../shared/auth/ProtectedRoute";
import PublicRoute from "../shared/auth/PublicRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/welcome"
        element={
          <PublicRoute>
            <WelcomePage />
          </PublicRoute>
        }
      />
      <Route
        path="/"
        element={
          <PublicRoute>
            <WelcomePage />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <WelcomePage />
          </PublicRoute>
        }
      />
      <Route
        path="/check-email"
        element={<CheckEmailPage />}
      />
      <Route
        path="/confirm-email"
        element={<ConfirmEmailPage />}
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai"
        element={
          <ProtectedRoute>
            <AIPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/support"
        element={
          <ProtectedRoute>
            <SupportPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="/Profile" element={<Navigate to="/profile" replace />} />
      <Route path="/AI" element={<Navigate to="/ai" replace />} />
      <Route path="/Support" element={<Navigate to="/support" replace />} />
      <Route path="/Welcome" element={<Navigate to="/welcome" replace />} />
      <Route path="/Login" element={<Navigate to="/login" replace />} />
      <Route path="/Dashboard" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
