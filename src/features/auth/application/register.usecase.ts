import { registerApi } from "../api/auth.api";
import type { RegisterPayload, RegisterResult } from "../domain/auth.types";
import { extractRegisterData, mapRegisterDtoToResult } from "../mappers/auth.mapper";

export async function registerUseCase(
  payload: RegisterPayload,
  options?: { signal?: AbortSignal },
): Promise<RegisterResult> {
  const response = await registerApi(
    {
      email: payload.email.trim(),
      username: payload.username.trim(),
      password: payload.password,
      confirmPassword: payload.confirmPassword,
    },
    options,
  );

  return mapRegisterDtoToResult(extractRegisterData(response));
}
