import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../shared/auth/AuthContext";

export default function RequireAuth() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/welcome" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
