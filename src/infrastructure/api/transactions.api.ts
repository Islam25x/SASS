import { requestJson } from "../../shared/api/http";

export async function fetchTransactionsApi(
  options?: { signal?: AbortSignal },
): Promise<unknown> {
  return requestJson<unknown>("/transactions", {
    method: "GET",
    signal: options?.signal,
  });
}
