import { createContext, useContext } from "react";
import type { AuthSession } from "../../auth/domain/auth.types";
import type { User } from "../../user/domain/user";

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
