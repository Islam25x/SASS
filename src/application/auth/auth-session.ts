import type { AuthSession, LoginResponse } from "../../domain/auth/auth.types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(source: Record<string, unknown>, key: string): string | undefined {
  const value = source[key];
  return typeof value === "string" && value.trim() ? value : undefined;
}

function collectTokenCandidates(payload: Record<string, unknown>): string[] {
  const directKeys = ["token", "accessToken", "jwt", "jwtToken"];
  const nestedKeys = ["data", "result", "payload", "user"];
  const candidates = directKeys
    .map((key) => readString(payload, key))
    .filter((value): value is string => Boolean(value));

  for (const nestedKey of nestedKeys) {
    const nestedValue = payload[nestedKey];
    if (!isRecord(nestedValue)) {
      continue;
    }

    candidates.push(
      ...directKeys
        .map((key) => readString(nestedValue, key))
        .filter((value): value is string => Boolean(value)),
    );
  }

  return candidates;
}

export function buildAuthSession(
  response: LoginResponse,
  fallbackEmail?: string,
): AuthSession | null {
  if (typeof response === "string" && response.trim()) {
    return {
      token: response.trim(),
      email: fallbackEmail,
      raw: response,
    };
  }

  if (!isRecord(response)) {
    return null;
  }

  const [token] = collectTokenCandidates(response);
  if (!token) {
    return null;
  }

  return {
    token,
    email: readString(response, "email") ?? fallbackEmail,
    username: readString(response, "username") ?? readString(response, "userName"),
    raw: response,
  };
}
