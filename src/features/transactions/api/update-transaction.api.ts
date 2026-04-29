import { getAuthApiBaseUrl } from "../../auth/api/auth.api";
import { requestJson } from "../../../infrastructure/api/http";
import type { AddTransactionPayload } from "../types/add-transaction.types";

export async function updateTransactionApi(
  transactionId: string,
  payload: AddTransactionPayload,
  options?: { signal?: AbortSignal },
): Promise<void> {
  await requestJson<unknown>(`/api/Transaction/${encodeURIComponent(transactionId)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    signal: options?.signal,
    baseUrl: getAuthApiBaseUrl(),
    withAuth: true,
  });
}
