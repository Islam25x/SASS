import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
} from "../../domain/auth/auth.types";
import { requestJson } from "./http";

const AUTH_API_BASE_URL =
  import.meta.env.VITE_FINEXA_API_BASE_URL?.trim() || "https://finexa.runasp.net";

export async function registerApi(
  payload: RegisterPayload,
  options?: { signal?: AbortSignal },
): Promise<RegisterResponse> {
  return requestJson<RegisterResponse>("/api/Auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
    signal: options?.signal,
    baseUrl: AUTH_API_BASE_URL,
  });
}

export async function loginApi(
  payload: LoginPayload,
  options?: { signal?: AbortSignal },
): Promise<LoginResponse> {
  return requestJson<LoginResponse>("/api/Auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
    signal: options?.signal,
    baseUrl: AUTH_API_BASE_URL,
  });
}

export function getAuthApiBaseUrl(): string {
  return AUTH_API_BASE_URL;
}
