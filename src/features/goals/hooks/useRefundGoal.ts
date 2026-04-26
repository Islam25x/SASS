import { useEffect, useRef } from "react";
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import { ApiError } from "../../../shared/api/api-error";
import { refundGoalApi } from "../api/refund-goal.api";
import { GOALS_QUERY_KEY } from "./useGoals";

type RefundGoalMutation = UseMutationResult<void, ApiError, string>;

type UseRefundGoalResult = RefundGoalMutation & {
  cancel: () => void;
};

export function useRefundGoal(): UseRefundGoalResult {
  const queryClient = useQueryClient();
  const abortControllerRef = useRef<AbortController | null>(null);

  const mutation = useMutation<void, ApiError, string>({
    mutationKey: ["goals", "refund"],
    mutationFn: async (goalId) => {
      const normalizedGoalId = goalId.trim();
      if (!normalizedGoalId) {
        throw new ApiError("Goal id is required.", 400, "INVALID_RESPONSE");
      }

      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        await refundGoalApi(normalizedGoalId, { signal: controller.signal });
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
