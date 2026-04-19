import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getCategoriesUseCase } from "../features/transactions/application/get-categories.usecase";
import type { TransactionCategory } from "../features/transactions/domain/category.types";
import { ApiError } from "../shared/api/api-error";
import { useAuth } from "../shared/auth/AuthContext";

export const TRANSACTION_CATEGORIES_QUERY_KEY = ["transactions", "categories"] as const;

type UseCategoriesOptions = {
  enabled?: boolean;
};

export function useCategories(
  options?: UseCategoriesOptions,
): UseQueryResult<TransactionCategory[], ApiError> {
  const { session } = useAuth();
  const token = session?.token ?? "";

  return useQuery<TransactionCategory[], ApiError>({
    queryKey: TRANSACTION_CATEGORIES_QUERY_KEY,
    queryFn: ({ signal }) =>
      getCategoriesUseCase({
        signal,
        accessToken: token,
      }),
    staleTime: 1000 * 60,
    enabled: (options?.enabled ?? true) && !!token,
  });
}
