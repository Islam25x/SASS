import { requestJson } from "./http";

export async function fetchTransactionsApi(
  options?: { signal?: AbortSignal },
): Promise<unknown> {
  return requestJson<unknown>("/transactions", {
    method: "GET",
    signal: options?.signal,
  });
}
