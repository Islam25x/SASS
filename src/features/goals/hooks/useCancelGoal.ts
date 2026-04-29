import { useEffect, useRef } from "react";
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import { ApiError } from "../../../infrastructure/api/api-error";
import { cancelGoalApi } from "../api/cancel-goal.api";
import { GOALS_QUERY_KEY } from "./useGoals";

type CancelGoalMutation = UseMutationResult<void, ApiError, string>;

type UseCancelGoalResult = CancelGoalMutation & {
  cancel: () => void;
};

export function useCancelGoal(): UseCancelGoalResult {
  const queryClient = useQueryClient();
  const abortControllerRef = useRef<AbortController | null>(null);

  const mutation = useMutation<void, ApiError, string>({
    mutationKey: ["goals", "cancel"],
    mutationFn: async (goalId) => {
      const normalizedGoalId = goalId.trim();
      if (!normalizedGoalId) {
        throw new ApiError("Goal id is required.", 400, "INVALID_RESPONSE");
      }

      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        await cancelGoalApi(normalizedGoalId, { signal: controller.signal });
      } finally {
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
      }
    },
    onSuccess: async (_, goalId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: GOALS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: ["goal-detail", goalId] }),
        queryClient.invalidateQueries({ queryKey: ["goal-history", goalId] }),
        queryClient.invalidateQueries({ queryKey: ["transactions"], exact: false }),
        queryClient.refetchQueries({ queryKey: ["transactions"] }),
      ]);
    },
    retry: 0,
  });

  useEffect(() => () => abortControllerRef.current?.abort(), []);

  return {
    ...mutation,
    cancel: () => abortControllerRef.current?.abort(),
  };
}
