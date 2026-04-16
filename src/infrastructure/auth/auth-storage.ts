import type { AuthSession } from "../../domain/auth/auth.types";

const AUTH_STORAGE_KEY = "finexa.auth.session";

export function readStoredAuthSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as AuthSession;
    if (!parsed?.token || typeof parsed.token !== "string") {
      clearStoredAuthSession();
      return null;
    }

    return parsed;
  } catch {
    clearStoredAuthSession();
    return null;
  }
}

export function writeStoredAuthSession(session: AuthSession): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredAuthSession(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function readStoredAuthToken(): string | null {
  return readStoredAuthSession()?.token ?? null;
}
