import {
  useCallback,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type PropsWithChildren,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { User } from "../../features/user/types/user.types";
import { API_UNAUTHORIZED_EVENT } from "../../infrastructure/api/http";
import {
  clearAuthSessionState,
  getAuthSessionSnapshot,
  patchAuthSession,
  setAuthSession,
  subscribeToAuthSession,
} from "../../infrastructure/auth/auth-session-store";
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
  const queryClient = useQueryClient();
  const session = useSyncExternalStore(
    subscribeToAuthSession,
    getAuthSessionSnapshot,
    () => null,
  );

  const login = useCallback((nextSession: NonNullable<AuthContextValue["session"]>) => {
    setAuthSession(nextSession);
  }, []);

  const setUser = useCallback((user: User) => {
    patchAuthSession((currentSession) => {
      if (!currentSession || areUsersEqual(currentSession.user, user)) {
        return currentSession;
      }

      return {
        ...currentSession,
        user,
      };
    });
  }, []);

  const logout = useCallback(() => {
    clearAuthSessionState();
    queryClient.clear();
  }, [queryClient]);

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
