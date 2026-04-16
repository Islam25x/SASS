import type { RegisterPayload } from "../domain/auth.types";
import type { RegisterResponseDto } from "../api/auth.dto";
import { registerApi } from "../api/auth.api";

export async function registerUseCase(
  payload: RegisterPayload,
  options?: { signal?: AbortSignal },
): Promise<RegisterResponseDto> {
  return registerApi(
    {
      email: payload.email.trim(),
      username: payload.username.trim(),
      password: payload.password,
      confirmPassword: payload.confirmPassword,
    },
    options,
  );
}
