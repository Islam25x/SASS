import { useQuery } from "@tanstack/react-query";
import { fetchTransactionsApi } from "../api/transactions.api";
import {
  mapTransactionsResponseToPage,
  type TransactionsPage,
} from "../utils/transaction.parser";
import { ApiError } from "../../../infrastructure/api/api-error";
import { useAuth } from "../../../shared/auth/AuthContext";
import { useDateRange } from "../../../shared/ui";
import type {
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

export function useTransactions(options?: UseTransactionsOptions) {
  const { session } = useAuth();
  const { selectedRange } = useDateRange();
  const token = session?.token ?? "";
  const typeFilter = options?.typeFilter ?? "all";
  const type =
    typeFilter === "income"
      ? "Income"
      : typeFilter === "expense"
        ? "Expense"
        : null;
  const categoryId = options?.categoryId ?? null;
  const fromDate = options?.fromDate ?? null;
  const toDate = options?.toDate ?? null;
  const pageNumber = options?.pageNumber;
  const pageSize = 4;

  return useQuery<TransactionsPage, ApiError>({
    queryKey: [
      "transactions",
      selectedRange,
      type,
      categoryId,
      fromDate,
      toDate,
      pageNumber,
      pageSize,
    ],
    queryFn: async ({ signal }) => {
      console.log({ pageNumber: pageNumber ?? 1 });

      if (!token) {
        throw new ApiError("Auth token is required to fetch transactions.", 401, "INVALID_RESPONSE");
      }

      const response = await fetchTransactionsApi(
        selectedRange,
        type,
        categoryId,
        fromDate,
        toDate,
        pageNumber,
        pageSize,
        {
          signal,
          accessToken: token,
        },
      );

      try {
        return mapTransactionsResponseToPage(response);
      } catch (error) {
        throw new ApiError("Invalid transactions response.", 500, "INVALID_RESPONSE", undefined, error);
      }
    },
    staleTime: 30_000,
    enabled: !!token,
  });
}
