import { Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SupportPage from "./pages/SupportPage";
import AIPage from "./pages/AIPage";
import ProfilePage from "./pages/ProfilePage";
import WelcomePage from "./pages/WelcomePage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/Profile" element={<ProfilePage />} />
      <Route path="/AI" element={<AIPage />} />
      <Route path="/Support" element={<SupportPage />} />
      <Route path="/Welcome" element={<WelcomePage />} />
      <Route path="/Dashboard" element={<DashboardPage />} />
      <Route path="/" element={<LoginPage />} />
      <Route path="/Register" element={<RegisterPage />} />
    </Routes>
  );
};

export default AppRoutes;
