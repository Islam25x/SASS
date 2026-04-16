import { useQuery } from "@tanstack/react-query";
import { fetchTransactionsUseCase } from "../application/transactions/fetch-transactions.usecase";
import type { Transaction } from "../domain/transactions/transaction.types";
import { ApiError } from "../shared/api/api-error";

export function useTransactions() {
  return useQuery<Transaction[], ApiError>({
    queryKey: ["transactions"],
    queryFn: () => fetchTransactionsUseCase(),
    staleTime: 30_000,
  });
}
