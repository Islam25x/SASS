import { Navigate, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import SupportPage from "./pages/SupportPage";
import AIPage from "./pages/AIPage";
import ProfilePage from "./pages/ProfilePage";
import WelcomePage from "./pages/WelcomePage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/ai" element={<AIPage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/" element={<WelcomePage />} />
      <Route path="/Profile" element={<Navigate to="/profile" replace />} />
      <Route path="/AI" element={<Navigate to="/ai" replace />} />
      <Route path="/Support" element={<Navigate to="/support" replace />} />
      <Route path="/Welcome" element={<Navigate to="/welcome" replace />} />
      <Route path="/Dashboard" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
