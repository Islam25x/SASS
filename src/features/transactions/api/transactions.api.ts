import { getAuthApiBaseUrl } from "../../auth/api/auth.api";
import { requestJson } from "../../../shared/api/http";
import type { TransactionsFilters } from "../domain/transactions-filter.types";

function buildTransactionsQuery(filters: TransactionsFilters): string {
  const params = new URLSearchParams();

  if (filters.type) {
    params.set("type", filters.type);
  }

  if (filters.categoryId) {
    params.set("categoryId", filters.categoryId);
  }

  if (filters.fromDate) {
    params.set("fromDate", filters.fromDate);
  }

  if (filters.toDate) {
    params.set("toDate", filters.toDate);
  }

  if (typeof filters.pageNumber === "number") {
    params.set("pageNumber", String(filters.pageNumber));
  }

  if (typeof filters.pageSize === "number") {
    params.set("pageSize", String(filters.pageSize));
  }

  const queryString = params.toString();
  return queryString ? `/api/Transaction/get-transactions?${queryString}` : "/api/Transaction/get-transactions";
}

export async function fetchTransactionsApi(
  filters: TransactionsFilters,
  options?: { signal?: AbortSignal; accessToken?: string },
): Promise<unknown> {
  return requestJson<unknown>(buildTransactionsQuery(filters), {
    method: "GET",
    signal: options?.signal,
    baseUrl: getAuthApiBaseUrl(),
    withAuth: true,
    accessToken: options?.accessToken,
  });
}
