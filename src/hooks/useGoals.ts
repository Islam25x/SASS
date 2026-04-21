import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { Goal } from "../domain/goals/goal.schema";
import { getGoalsUseCase } from "../features/goals/application/get-goals.usecase";
import { ApiError } from "../shared/api/api-error";
import { useAuth } from "../shared/auth/AuthContext";

export const GOALS_QUERY_KEY = ["goals"] as const;

export function useGoals(): UseQueryResult<Goal[], ApiError> {
  const { session } = useAuth();
  const token = session?.token ?? "";

  return useQuery<Goal[], ApiError>({
    queryKey: GOALS_QUERY_KEY,
    queryFn: ({ signal }) =>
      getGoalsUseCase({
        signal,
        accessToken: token,
      }),
    staleTime: 1000 * 60,
    enabled: !!token,
  });
}
