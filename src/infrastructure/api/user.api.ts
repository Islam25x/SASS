import type {
  UpdateUserProfilePayload,
  UpdateUserProfileResponse,
  UserProfileResponse,
} from "../../domain/user/user.types";
import { requestJson } from "./http";
import { getAuthApiBaseUrl } from "./auth.api";

export async function fetchUserProfileApi(
  options?: { signal?: AbortSignal },
): Promise<UserProfileResponse> {
  return requestJson<UserProfileResponse>("/api/User/profile", {
    method: "GET",
    signal: options?.signal,
    baseUrl: getAuthApiBaseUrl(),
    withAuth: true,
  });
}

export async function updateUserProfileApi(
  payload: UpdateUserProfilePayload,
  options?: { signal?: AbortSignal },
): Promise<UpdateUserProfileResponse> {
  return requestJson<UpdateUserProfileResponse>("/api/User/profile", {
    method: "PUT",
    body: JSON.stringify(payload),
    signal: options?.signal,
    baseUrl: getAuthApiBaseUrl(),
    withAuth: true,
  });
}
