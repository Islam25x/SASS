import { getAuthApiBaseUrl } from "../../features/auth/api/auth.api";
import { requestJson } from "../../shared/api/http";

export async function fetchTransactionsApi(
  options?: { signal?: AbortSignal; accessToken?: string },
): Promise<unknown> {
  return requestJson<unknown>("/api/Transaction/get-transactions", {
    method: "GET",
    signal: options?.signal,
    baseUrl: getAuthApiBaseUrl(),
    withAuth: true,
    accessToken: options?.accessToken,
  });
}
