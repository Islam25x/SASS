import { loginApi } from "../api/auth.api";
import type { AuthSession, LoginPayload } from "../domain/auth.types";
import {
  extractLoginData,
  mapLoginDtoToSession,
  mapLoginDtoToToken,
} from "../mappers/auth.mapper";
import { fetchUserProfileApi } from "../../user/api/user.api";
import { extractUserData, mapUserDtoToUser } from "../../user/mappers/user.mapper";

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

  const loginData = extractLoginData(loginResponse);
  const profileResponse = await fetchUserProfileApi({
    signal: options?.signal,
    accessToken: mapLoginDtoToToken(loginData),
  });
  const userData = extractUserData(profileResponse);
  const user = mapUserDtoToUser(userData);

  return mapLoginDtoToSession(loginData, user);
}
