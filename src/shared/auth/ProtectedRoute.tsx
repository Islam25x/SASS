import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

type ProtectedRouteProps = {
  children: ReactNode;
};

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { session } = useAuth();

  if (!session?.token) {
    return <Navigate to="/welcome" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
