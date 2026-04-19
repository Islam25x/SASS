import { useCallback, useMemo, useState, type PropsWithChildren } from "react";
import { useEffect } from "react";
import {
  clearStoredAuthSession,
  readStoredAuthSession,
  writeStoredAuthSession,
} from "../../infrastructure/auth/auth-storage";
import type { User } from "../../features/user/domain/user";
import { API_UNAUTHORIZED_EVENT } from "../api/http";
import { AuthContext, type AuthContextValue } from "./AuthContext";

function areUsersEqual(currentUser: User, nextUser: User): boolean {
  return (
    currentUser.id === nextUser.id &&
    currentUser.email === nextUser.email &&
    currentUser.username === nextUser.username &&
    currentUser.firstName === nextUser.firstName &&
    currentUser.lastName === nextUser.lastName &&
    currentUser.phoneNumber === nextUser.phoneNumber &&
    currentUser.dateOfBirth?.getTime() === nextUser.dateOfBirth?.getTime() &&
    currentUser.profileImageUrl === nextUser.profileImageUrl
  );
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState(() => readStoredAuthSession());

  const login = useCallback((nextSession: NonNullable<AuthContextValue["session"]>) => {
    writeStoredAuthSession(nextSession);
    setSession(nextSession);
  }, []);

  const setUser = useCallback((user: User) => {
    setSession((currentSession) => {
      if (!currentSession || areUsersEqual(currentSession.user, user)) {
        return currentSession;
      }

      const nextSession = {
        ...currentSession,
        user,
      };

      writeStoredAuthSession(nextSession);
      return nextSession;
    });
  }, []);

  const logout = useCallback(() => {
    clearStoredAuthSession();
    setSession(null);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener(API_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => {
      window.removeEventListener(API_UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, [logout]);

  const value: AuthContextValue = useMemo(() => ({
    session,
    isAuthenticated: Boolean(session?.token),
    login,
    setUser,
    logout,
  }), [login, logout, session, setUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
