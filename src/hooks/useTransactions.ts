import { useQuery } from "@tanstack/react-query";
import { ApiError, fetchTransactions, type Transaction } from "../services/ai.api";

export function useTransactions() {
  return useQuery<Transaction[], ApiError>({
    queryKey: ["transactions"],
    queryFn: () => fetchTransactions(),
    staleTime: 30_000,
  });
}

