import { requestJson } from "../../../infrastructure/api/http";
import type { ResendConfirmationPayload } from "../types/auth.types";
import { getAuthApiBaseUrl } from "./auth.api";

export async function resendConfirmationApi(
  payload: ResendConfirmationPayload,
  options?: { signal?: AbortSignal },
): Promise<unknown> {
  const query = new URLSearchParams({
    email: payload.email,
  });

  return requestJson<unknown>(`/api/Auth/resend-confirmation-link?${query.toString()}`, {
    method: "POST",
    signal: options?.signal,
    baseUrl: getAuthApiBaseUrl(),
  });
}
