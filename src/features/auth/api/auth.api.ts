import { requestJson } from "../../../infrastructure/api/http";
export { refreshAccessToken } from "../../../infrastructure/api/auth-refresh";
import type { LoginRequestDto, RegisterRequestDto } from "./auth.dto";
import { getAuthApiBaseUrl } from "./auth-config";

export const REGISTER_SUCCESS_MESSAGE =
  "Registration successful. Please check your email to confirm your account.";

export async function registerApi(
  payload: RegisterRequestDto,
  options?: { signal?: AbortSignal },
): Promise<unknown> {
  return requestJson<unknown>("/api/Auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
    signal: options?.signal,
    baseUrl: getAuthApiBaseUrl(),
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
    baseUrl: getAuthApiBaseUrl(),
  });
}

export async function logoutApi(
  options?: { signal?: AbortSignal },
): Promise<void> {
  await requestJson<unknown>("/api/Auth/logout", {
    method: "POST",
    signal: options?.signal,
    baseUrl: getAuthApiBaseUrl(),
    withAuth: true,
  });
}

export { getAuthApiBaseUrl } from "./auth-config";
