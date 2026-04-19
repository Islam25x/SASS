import { getAuthApiBaseUrl } from "../../auth/api/auth.api";
import { requestJson } from "../../../shared/api/http";

export async function getCategoriesApi(
  options?: { signal?: AbortSignal; accessToken?: string },
): Promise<unknown> {
  return requestJson<unknown>("/api/Category/get-categories", {
    method: "GET",
    signal: options?.signal,
    baseUrl: getAuthApiBaseUrl(),
    withAuth: true,
    accessToken: options?.accessToken,
  });
}
