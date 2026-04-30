import { requestJson } from "../../../infrastructure/api/http";
import { getAppApiBaseUrl } from "../../../infrastructure/api/api-config";
import type { ConfirmEmailPayload } from "../types/auth.types";

export async function confirmEmailApi(
  payload: ConfirmEmailPayload,
  options?: { signal?: AbortSignal },
): Promise<unknown> {
  const query = new URLSearchParams({
    userId: payload.userId,
    token: payload.token,
  });

  return requestJson<unknown>(`/api/Auth/confirm-email?${query.toString()}`, {
    method: "GET",
    signal: options?.signal,
    baseUrl: getAppApiBaseUrl(),
  });
}
