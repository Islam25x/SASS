import { useQuery } from "@tanstack/react-query";
import { fetchTransactionsApi } from "../api/transactions.api";
import type { Transaction } from "../types/transaction.types";
import { mapTransactionsResponseToTransactions } from "../utils/transaction.parser";
import { ApiError } from "../../../shared/api/api-error";
import { useAuth } from "../../../shared/auth/AuthContext";
import type {
  TransactionsFilters,
  TransactionsTypeUiFilter,
} from "../types/transactions-filter.types";

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
    queryFn: async ({ signal }) => {
      if (!token) {
        throw new ApiError("Auth token is required to fetch transactions.", 401, "INVALID_RESPONSE");
      }

      const response = await fetchTransactionsApi(filters, {
        signal,
        accessToken: token,
      });

      try {
        return mapTransactionsResponseToTransactions(response);
      } catch (error) {
        throw new ApiError("Invalid transactions response.", 500, "INVALID_RESPONSE", undefined, error);
      }
    },
    staleTime: 30_000,
    enabled: !!token,
  });
}
