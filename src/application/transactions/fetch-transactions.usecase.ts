import { parseTransactionList } from "../../domain/transactions/transaction.rules";
import type { Transaction } from "../../domain/transactions/transaction.types";
import { ApiError } from "../../infrastructure/api/api-error";
import { fetchTransactionsApi } from "../../infrastructure/api/transactions.api";

export async function fetchTransactionsUseCase(
  options?: { signal?: AbortSignal },
): Promise<Transaction[]> {
  const payload = await fetchTransactionsApi(options);

  try {
    return parseTransactionList(payload);
  } catch (error) {
    throw new ApiError("Invalid transactions response.", 500, "INVALID_RESPONSE", undefined, error);
  }
}
