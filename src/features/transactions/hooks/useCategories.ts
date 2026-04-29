import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getCategoriesApi } from "../api/get-categories.api";
import type { TransactionCategory } from "../types/category.types";
import { parseCategories } from "../utils/category.parser";
import { ApiError } from "../../../infrastructure/api/api-error";
import { useAuth } from "../../../shared/auth/AuthContext";

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
    queryFn: async ({ signal }) => {
      const response = await getCategoriesApi({
        signal,
        accessToken: token,
      });

      return parseCategories(response);
    },
    staleTime: 1000 * 60,
    enabled: (options?.enabled ?? true) && !!token,
  });
}
