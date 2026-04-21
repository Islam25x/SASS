import type { Transaction } from "../../features/transactions/types/transaction.types";
import { ApiError } from "../../shared/api/api-error";
import { fetchTransactionsApi } from "../../features/transactions/api/transactions.api";
import { mapTransactionsResponseToTransactions } from "../../features/transactions/application/transaction.mapping";
import type { TransactionsFilters } from "../../features/transactions/types/transactions-filter.types";

export async function fetchTransactionsUseCase(
  input: { accessToken?: string; filters?: TransactionsFilters },
  options?: { signal?: AbortSignal },
): Promise<Transaction[]> {
  const accessToken = input.accessToken?.trim();

  if (!accessToken) {
    throw new ApiError("Auth token is required to fetch transactions.", 401, "INVALID_RESPONSE");
  }

  const response = await fetchTransactionsApi(input.filters ?? {}, {
    signal: options?.signal,
    accessToken,
  });

  try {
    return mapTransactionsResponseToTransactions(response);
  } catch (error) {
    throw new ApiError("Invalid transactions response.", 500, "INVALID_RESPONSE", undefined, error);
  }
}
