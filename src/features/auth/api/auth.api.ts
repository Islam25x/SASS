import { requestJson } from "../../../shared/api/http";
import type { LoginRequestDto, RegisterRequestDto } from "./auth.dto";

const AUTH_API_BASE_URL =
  import.meta.env.VITE_FINEXA_API_BASE_URL?.trim() || "https://finexa.runasp.net";

export async function registerApi(
  payload: RegisterRequestDto,
  options?: { signal?: AbortSignal },
): Promise<unknown> {
  return requestJson<unknown>("/api/Auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
    signal: options?.signal,
    baseUrl: AUTH_API_BASE_URL,
  });
}

export async function loginApi(
  payload: LoginRequestDto,
  options?: { signal?: AbortSignal },
): Promise<unknown> {
  return requestJson<unknown>("/api/Auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
    signal: options?.signal,
    baseUrl: AUTH_API_BASE_URL,
  });
}

export function getAuthApiBaseUrl(): string {
  return AUTH_API_BASE_URL;
}
