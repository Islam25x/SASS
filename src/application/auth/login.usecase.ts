import type { LoginPayload, LoginResponse } from "../../domain/auth/auth.types";
import { loginApi } from "../../infrastructure/api/auth.api";

export async function loginUseCase(
  payload: LoginPayload,
  options?: { signal?: AbortSignal },
): Promise<LoginResponse> {
  return loginApi(
    {
      email: payload.email.trim(),
      password: payload.password,
    },
    options,
  );
}
