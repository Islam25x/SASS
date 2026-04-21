import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getGoalsApi } from "../api/get-goals.api";
import type { Goal } from "../types/goal.types";
import { parseGoals } from "../utils/goal.parser";
import { ApiError } from "../../../shared/api/api-error";
import { useAuth } from "../../../shared/auth/AuthContext";

export const GOALS_QUERY_KEY = ["goals"] as const;

export function useGoals(): UseQueryResult<Goal[], ApiError> {
  const { session } = useAuth();
  const token = session?.token ?? "";

  return useQuery<Goal[], ApiError>({
    queryKey: GOALS_QUERY_KEY,
    queryFn: async ({ signal }) => {
      const response = await getGoalsApi({
        signal,
        accessToken: token,
      });

      return parseGoals(response);
    },
    staleTime: 1000 * 60,
    enabled: !!token,
  });
}
