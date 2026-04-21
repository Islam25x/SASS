import type { LoginResponseDto, RegisterResponseDto } from "../api/auth.dto";
import type { AuthSession, RegisterResult } from "../types/auth.types";
import type { User } from "../../user/types/user.types";
import {
  createInvalidResponseError,
  decodeJwtSegment,
  isObject,
  safeTrim,
  toFiniteNumber,
  toTrimmedString,
} from "../../../shared/utils/mapper.utils";

interface EnvelopeCandidate {
  data?: unknown;
  result?: unknown;
  payload?: unknown;
  user?: unknown;
}

interface RawLoginCandidate {
  token?: unknown;
  accessToken?: unknown;
  jwt?: unknown;
  jwtToken?: unknown;
  expiresAt?: unknown;
  expiresIn?: unknown;
}

interface RawRegisterCandidate {
  message?: unknown;
}

function unwrapEnvelope(response: unknown): unknown {
  if (!isObject(response)) {
    return response;
  }

  const candidate = response as EnvelopeCandidate;
  return candidate.data ?? candidate.result ?? candidate.payload ?? candidate.user ?? response;
}

export function extractLoginData(response: unknown): unknown {
  return unwrapEnvelope(response);
}

export function extractRegisterData(response: unknown): unknown {
  return unwrapEnvelope(response);
}

function parseLoginResponseDto(data: unknown): LoginResponseDto {
  if (typeof data === "string") {
    const token = safeTrim(data);
    if (!token) {
      throw createInvalidResponseError(
        "INVALID_AUTH_TOKEN",
        "Login response did not include a valid auth token.",
      );
    }

    return {
      token,
      expiresAt: null,
      expiresIn: null,
    };
  }

  if (!isObject(data)) {
    throw createInvalidResponseError(
      "INVALID_LOGIN_RESPONSE",
      "Login response payload is not a valid object.",
    );
  }

  const candidate = data as RawLoginCandidate;
  const token =
    toTrimmedString(candidate.token) ??
    toTrimmedString(candidate.accessToken) ??
    toTrimmedString(candidate.jwt) ??
    toTrimmedString(candidate.jwtToken);

  if (!token) {
    throw createInvalidResponseError(
      "INVALID_AUTH_TOKEN",
      "Login response did not include a valid auth token.",
    );
  }

  return {
    token,
    expiresAt: toTrimmedString(candidate.expiresAt),
    expiresIn: toFiniteNumber(candidate.expiresIn),
  };
}

function parseRegisterResponseDto(data: unknown): RegisterResponseDto {
  if (!isObject(data)) {
    throw createInvalidResponseError(
      "INVALID_REGISTER_RESPONSE",
      "Register response payload is not a valid object.",
    );
  }

  const candidate = data as RawRegisterCandidate;
  const message = toTrimmedString(candidate.message);

  if (!message) {
    throw createInvalidResponseError(
      "INVALID_REGISTER_MESSAGE",
      "Register response did not include a confirmation message.",
    );
  }

  return {
    message,
  };
}

function decodeJwtPayload(token: string): { exp?: number } | null {
  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }

  try {
    const payload = decodeJwtSegment(parts[1]);
    return JSON.parse(payload) as { exp?: number };
  } catch {
    return null;
  }
}

function readExpiresAt(dto: LoginResponseDto): Date {
  if (dto.expiresAt) {
    const parsedDate = new Date(dto.expiresAt);
    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  }

  if (typeof dto.expiresIn === "number") {
    return new Date(Date.now() + dto.expiresIn * 1000);
  }

  const jwtPayload = decodeJwtPayload(dto.token);
  if (typeof jwtPayload?.exp === "number" && Number.isFinite(jwtPayload.exp)) {
    return new Date(jwtPayload.exp * 1000);
  }

  return new Date(Date.now() + 5 * 60 * 1000);
}

export function readLoginToken(data: unknown): string {
  return parseLoginResponseDto(data).token;
}

export function parseAuthSession(data: unknown, user: User): AuthSession {
  const dto = parseLoginResponseDto(data);

  return {
    token: dto.token,
    expiresAt: readExpiresAt(dto),
    user,
  };
}

export function parseRegisterResult(data: unknown): RegisterResult {
  const dto = parseRegisterResponseDto(data);

  return {
    message: dto.message,
  };
}
