import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getGoalsApi } from "../api/get-goals.api";
import { parseGoalsPage, type GoalsPage } from "../utils/goal.parser";
import { ApiError } from "../../../infrastructure/api/api-error";
import { useAuth } from "../../../shared/auth/AuthContext";

export const GOALS_QUERY_KEY = ["goals"] as const;

const GOALS_PAGE_SIZE = 2;

export function useGoals(pageNumber = 1): UseQueryResult<GoalsPage, ApiError> {
  const { isAuthenticated } = useAuth();

  return useQuery<GoalsPage, ApiError>({
    queryKey: [...GOALS_QUERY_KEY, pageNumber, GOALS_PAGE_SIZE],
    queryFn: async ({ signal }) => {
      const response = await getGoalsApi(pageNumber, {
        signal,
      });

      return parseGoalsPage(response);
    },
    staleTime: 1000 * 60,
    enabled: isAuthenticated,
  });
}
