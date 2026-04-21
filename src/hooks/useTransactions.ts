import { useQuery } from "@tanstack/react-query";
import { fetchTransactionsUseCase } from "../application/transactions/fetch-transactions.usecase";
import type { Transaction } from "../features/transactions/types/transaction.types";
import { ApiError } from "../shared/api/api-error";
import { useAuth } from "../shared/auth/AuthContext";
import type {
  TransactionsFilters,
  TransactionsTypeUiFilter,
} from "../features/transactions/types/transactions-filter.types";

type UseTransactionsOptions = {
  typeFilter?: TransactionsTypeUiFilter;
  categoryId?: string | null;
  fromDate?: string | null;
  toDate?: string | null;
  pageNumber?: number;
  pageSize?: number;
};

function mapUiFilterToTransactionsFilters(
  options?: UseTransactionsOptions,
): TransactionsFilters {
  const typeFilter = options?.typeFilter ?? "all";

  return {
    type:
      typeFilter === "income"
        ? "Income"
        : typeFilter === "expense"
          ? "Expense"
          : null,
    categoryId: options?.categoryId ?? null,
    fromDate: options?.fromDate ?? null,
    toDate: options?.toDate ?? null,
    pageNumber: options?.pageNumber,
    pageSize: options?.pageSize,
  };
}

export function useTransactions(options?: UseTransactionsOptions) {
  const { session } = useAuth();
  const token = session?.token ?? "";
  const filters = mapUiFilterToTransactionsFilters(options);

  return useQuery<Transaction[], ApiError>({
    queryKey: ["transactions", filters],
    queryFn: ({ signal }) =>
      fetchTransactionsUseCase(
        {
          accessToken: token,
          filters,
        },
        { signal },
      ),
    staleTime: 30_000,
    enabled: !!token,
  });
}
