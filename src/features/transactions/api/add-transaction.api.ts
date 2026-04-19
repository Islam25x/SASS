import { getAuthApiBaseUrl } from "../../auth/api/auth.api";
import { requestJson } from "../../../shared/api/http";
import type { AddTransactionPayload } from "../domain/add-transaction.types";

export async function addTransactionApi(
  payload: AddTransactionPayload,
  options?: { signal?: AbortSignal },
): Promise<void> {
  await requestJson<unknown>("/api/Transaction/add-transaction", {
    method: "POST",
    body: JSON.stringify(payload),
    signal: options?.signal,
    baseUrl: getAuthApiBaseUrl(),
    withAuth: true,
  });
}
