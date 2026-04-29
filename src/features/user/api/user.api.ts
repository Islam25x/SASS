import { requestJson } from "../../../infrastructure/api/http";
import { getAuthApiBaseUrl } from "../../auth/api/auth.api";
import type {
  UpdateUserProfileRequestDto,
  UpdateUserProfileResponseDto,
} from "./user.dto";

export async function fetchUserProfileApi(
  options?: { signal?: AbortSignal; accessToken?: string },
): Promise<unknown> {
  return requestJson<unknown>("/api/User/profile", {
    method: "GET",
    signal: options?.signal,
    baseUrl: getAuthApiBaseUrl(),
    withAuth: true,
    accessToken: options?.accessToken,
  });
}

export async function updateUserProfileApi(
  payload: UpdateUserProfileRequestDto,
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
export async function uploadImage(
  file: File,
  options?: { signal?: AbortSignal },
): Promise<UpdateUserProfileResponseDto> {
  const formData = new FormData();
  formData.append("file", file);
  return requestJson<UpdateUserProfileResponseDto>("/api/User/upload-image", {
    method: "POST",
    body: formData,
    signal: options?.signal,
    baseUrl: getAuthApiBaseUrl(),
    withAuth: true,
  });
}
