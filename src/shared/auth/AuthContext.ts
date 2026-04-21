import { createContext, useContext } from "react";
import type { AuthSession } from "../../features/auth/types/auth.types";
import type { User } from "../../features/user/types/user.types";

export interface AuthContextValue {
  session: AuthSession | null;
  isAuthenticated: boolean;
  login: (nextSession: AuthSession) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
