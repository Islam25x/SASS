import type {
  LoginDataEnvelopeDto,
  LoginPayloadEnvelopeDto,
  LoginResponseDto,
  LoginResultEnvelopeDto,
  LoginTokenDto,
  LoginUserEnvelopeDto,
  RegisterDataEnvelopeDto,
  RegisterPayloadEnvelopeDto,
  RegisterResponseDto,
  RegisterResultDto,
  RegisterResultEnvelopeDto,
} from "../api/auth.dto";
import type { AuthSession } from "../domain/auth.types";
import type { User } from "../../user/domain/user";

function isLoginDataEnvelopeDto(value: LoginResponseDto): value is LoginDataEnvelopeDto {
  return typeof value === "object" && value !== null && "data" in value;
}

function isLoginResultEnvelopeDto(value: LoginResponseDto): value is LoginResultEnvelopeDto {
  return typeof value === "object" && value !== null && "result" in value;
}

function isLoginPayloadEnvelopeDto(value: LoginResponseDto): value is LoginPayloadEnvelopeDto {
  return typeof value === "object" && value !== null && "payload" in value;
}

function isLoginUserEnvelopeDto(value: LoginResponseDto): value is LoginUserEnvelopeDto {
  return typeof value === "object" && value !== null && "user" in value;
}

function unwrapLoginTokenDto(response: LoginResponseDto): LoginTokenDto {
  if (typeof response === "string") {
    return { token: response.trim() };
  }

  if (isLoginDataEnvelopeDto(response)) {
    return response.data;
  }

  if (isLoginResultEnvelopeDto(response)) {
    return response.result;
  }

  if (isLoginPayloadEnvelopeDto(response)) {
    return response.payload;
  }

  if (isLoginUserEnvelopeDto(response)) {
    return response.user;
  }

  return response;
}

function readToken(dto: LoginTokenDto): string {
  const token = dto.token ?? dto.accessToken ?? dto.jwt ?? dto.jwtToken ?? "";
  return token.trim();
}

function decodeJwtPayload(token: string): { exp?: number } | null {
  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const payload = window.atob(padded);
    return JSON.parse(payload) as { exp?: number };
  } catch {
    return null;
  }
}

function readExpiresAt(dto: LoginTokenDto, token: string): Date {
  if (dto.expiresAt) {
    const parsedDate = new Date(dto.expiresAt);
    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  }

  if (typeof dto.expiresIn === "number" && Number.isFinite(dto.expiresIn)) {
    return new Date(Date.now() + dto.expiresIn * 1000);
  }

  const jwtPayload = decodeJwtPayload(token);
  if (typeof jwtPayload?.exp === "number" && Number.isFinite(jwtPayload.exp)) {
    return new Date(jwtPayload.exp * 1000);
  }

  return new Date(0);
}

export function mapLoginResponseToSession(dto: LoginResponseDto, user: User): AuthSession {
  const tokenDto = unwrapLoginTokenDto(dto);
  const token = readToken(tokenDto);

  if (!token) {
    throw new Error("Login succeeded but no auth token was returned by the API.");
  }

  return {
    token,
    expiresAt: readExpiresAt(tokenDto, token),
    user,
  };
}

export function mapLoginResponseToToken(dto: LoginResponseDto): string {
  const token = readToken(unwrapLoginTokenDto(dto));

  if (!token) {
    throw new Error("Login succeeded but no auth token was returned by the API.");
  }

  return token;
}

function isRegisterDataEnvelopeDto(
  response: RegisterResponseDto,
): response is RegisterDataEnvelopeDto {
  return typeof response === "object" && response !== null && "data" in response;
}

function isRegisterResultEnvelopeDto(
  response: RegisterResponseDto,
): response is RegisterResultEnvelopeDto {
  return typeof response === "object" && response !== null && "result" in response;
}

function isRegisterPayloadEnvelopeDto(
  response: RegisterResponseDto,
): response is RegisterPayloadEnvelopeDto {
  return typeof response === "object" && response !== null && "payload" in response;
}

function unwrapRegisterResultDto(response: RegisterResponseDto): RegisterResultDto | null {
  if (response === null) {
    return null;
  }

  if (isRegisterDataEnvelopeDto(response)) {
    return response.data;
  }

  if (isRegisterResultEnvelopeDto(response)) {
    return response.result;
  }

  if (isRegisterPayloadEnvelopeDto(response)) {
    return response.payload;
  }

  return response;
}

export function readRegisterMessage(response: RegisterResponseDto): string {
  return unwrapRegisterResultDto(response)?.message?.trim() ?? "";
}
