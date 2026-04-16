import type { AuthSession } from "../../features/auth/domain/auth.types";
import type { User } from "../../features/user/domain/user";

const AUTH_STORAGE_KEY = "finexa.auth.session";

function isValidDate(value: Date): boolean {
  return !Number.isNaN(value.getTime());
}

function parseStoredUser(value: unknown): User | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const candidate = value as {
    id?: unknown;
    email?: unknown;
    username?: unknown;
    firstName?: unknown;
    lastName?: unknown;
    phoneNumber?: unknown;
    dateOfBirth?: unknown;
    profileImageUrl?: unknown;
  };

  if (
    typeof candidate.id !== "string" ||
    typeof candidate.email !== "string" ||
    typeof candidate.username !== "string" ||
    typeof candidate.firstName !== "string" ||
    typeof candidate.lastName !== "string" ||
    typeof candidate.phoneNumber !== "string" ||
    (candidate.profileImageUrl !== null && typeof candidate.profileImageUrl !== "string")
  ) {
    return null;
  }

  const dateOfBirth =
    typeof candidate.dateOfBirth === "string" && candidate.dateOfBirth
      ? new Date(candidate.dateOfBirth)
      : null;

  if (dateOfBirth && !isValidDate(dateOfBirth)) {
    return null;
  }

  return {
    id: candidate.id,
    email: candidate.email,
    username: candidate.username,
    firstName: candidate.firstName,
    lastName: candidate.lastName,
    phoneNumber: candidate.phoneNumber,
    dateOfBirth,
    profileImageUrl: candidate.profileImageUrl,
  };
}

function parseLegacyStoredUser(value: {
  email?: unknown;
  username?: unknown;
}): User {
  return {
    id: "",
    email: typeof value.email === "string" ? value.email : "",
    username: typeof value.username === "string" ? value.username : "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    dateOfBirth: null,
    profileImageUrl: null,
  };
}

export function readStoredAuthSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as {
      token?: unknown;
      expiresAt?: unknown;
      user?: unknown;
      email?: unknown;
      username?: unknown;
    };
    const user = parseStoredUser(parsed.user) ?? parseLegacyStoredUser(parsed);
    const expiresAt =
      typeof parsed.expiresAt === "string" ? new Date(parsed.expiresAt) : null;

    if (
      typeof parsed.token !== "string" ||
      !parsed.token ||
      !user
    ) {
      clearStoredAuthSession();
      return null;
    }

    return {
      token: parsed.token,
      expiresAt: expiresAt && isValidDate(expiresAt) ? expiresAt : new Date(0),
      user,
    };
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
