import type { RegisterPayload, RegisterResponse } from "../../domain/auth/auth.types";
import { registerApi } from "../../infrastructure/api/auth.api";

export async function registerUseCase(
  payload: RegisterPayload,
  options?: { signal?: AbortSignal },
): Promise<RegisterResponse> {
  const normalizedPayload: RegisterPayload = {
    email: payload.email.trim(),
    username: payload.username.trim(),
    password: payload.password,
    confirmPassword: payload.confirmPassword,
  };

  return registerApi(normalizedPayload, options);
}
