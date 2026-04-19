import { getAuthApiBaseUrl } from "../../auth/api/auth.api";
import { requestJson } from "../../../shared/api/http";

export async function deleteTransactionApi(
  transactionId: string,
  options?: { signal?: AbortSignal },
): Promise<void> {
  await requestJson<unknown>(`/api/Transaction/${encodeURIComponent(transactionId)}`, {
    method: "DELETE",
    signal: options?.signal,
    baseUrl: getAuthApiBaseUrl(),
    withAuth: true,
  });
}
