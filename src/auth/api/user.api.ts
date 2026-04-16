import { requestJson } from "../../infrastructure/api/http";
import type {
  UpdateUserProfilePayload,
  UpdateUserProfileResponseDto,
} from "../../user/domain/user";
import type { UserProfileResponseDto } from "./user.dto";
import { getAuthApiBaseUrl } from "./auth.api";

export async function fetchUserProfileApi(
  options?: { signal?: AbortSignal; accessToken?: string },
): Promise<UserProfileResponseDto> {
  return requestJson<UserProfileResponseDto>("/api/User/profile", {
    method: "GET",
    signal: options?.signal,
    baseUrl: getAuthApiBaseUrl(),
    withAuth: true,
    headers: options?.accessToken
      ? {
          Authorization: `Bearer ${options.accessToken}`,
        }
      : undefined,
  });
}

export async function updateUserProfileApi(
  payload: UpdateUserProfilePayload,
  options?: { signal?: AbortSignal },
): Promise<UpdateUserProfileResponseDto> {
  return requestJson<UpdateUserProfileResponseDto>("/api/User/profile", {
    method: "PUT",
    body: JSON.stringify(payload),
    signal: options?.signal,
    baseUrl: getAuthApiBaseUrl(),
    withAuth: true,
  });
}
