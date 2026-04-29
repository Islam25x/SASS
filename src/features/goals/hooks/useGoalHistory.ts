import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { ApiError } from "../../../infrastructure/api/api-error";
import { useAuth } from "../../../shared/auth/AuthContext";
import { getGoalHistoryApi } from "../api/get-goal-history.api";
import type { GoalHistoryPage } from "../types/goal.types";
import { parseGoalHistory } from "../utils/goal.parser";

const GOAL_HISTORY_PAGE_SIZE = 2;

export function useGoalHistory(
  goalId: string | null,
  pageNumber: number,
): UseQueryResult<GoalHistoryPage, ApiError> {
  const { session } = useAuth();
  const token = session?.token ?? "";
  const normalizedGoalId = goalId?.trim() ?? "";

  return useQuery<GoalHistoryPage, ApiError>({
    queryKey: ["goal-history", normalizedGoalId, pageNumber, GOAL_HISTORY_PAGE_SIZE],
    queryFn: async ({ signal }) => {
      const response = await getGoalHistoryApi(normalizedGoalId, pageNumber, {
        signal,
        accessToken: token,
      });

      return parseGoalHistory(response);
    },
    enabled: !!token && normalizedGoalId.length > 0,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}
