import { useState, type PropsWithChildren } from "react";
import {
  clearStoredAuthSession,
  readStoredAuthSession,
  writeStoredAuthSession,
} from "../../infrastructure/auth/auth-storage";
import { AuthContext, type AuthContextValue } from "./AuthContext";

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState(() => readStoredAuthSession());

  const value: AuthContextValue = {
    session,
    isAuthenticated: Boolean(session?.token),
    login: (nextSession) => {
      writeStoredAuthSession(nextSession);
      setSession(nextSession);
    },
    setUser: (user) => {
      setSession((currentSession) => {
        if (!currentSession) {
          return currentSession;
        }

        const nextSession = {
          ...currentSession,
          user,
        };

        writeStoredAuthSession(nextSession);
        return nextSession;
      });
    },
    logout: () => {
      clearStoredAuthSession();
      setSession(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
