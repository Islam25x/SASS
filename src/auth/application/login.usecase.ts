import type { LoginPayload, AuthSession } from "../domain/auth.types";
import { loginApi } from "../api/auth.api";
import { fetchUserProfileApi } from "../api/user.api";
import { mapLoginResponseToSession, mapLoginResponseToToken } from "../mappers/auth.mapper";
import { mapProfileToUser } from "../mappers/user.mapper";

export async function loginUseCase(
  payload: LoginPayload,
  options?: { signal?: AbortSignal },
): Promise<AuthSession> {
  const loginResponse = await loginApi(
    {
      email: payload.email.trim(),
      password: payload.password,
    },
    options,
  );

  const token = mapLoginResponseToToken(loginResponse);
  const profileResponse = await fetchUserProfileApi({
    signal: options?.signal,
    accessToken: token,
  });
  const user = mapProfileToUser(profileResponse);

  return mapLoginResponseToSession(loginResponse, user);
}
