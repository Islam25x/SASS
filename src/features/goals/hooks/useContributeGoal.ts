import { useEffect, useRef } from "react";
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import { ApiError } from "../../../infrastructure/api/api-error";
import { contributeGoalApi } from "../api/contribute-goal.api";
import { GOALS_QUERY_KEY } from "./useGoals";

type ContributeGoalPayload = {
  goalId: string;
  amount: number;
};

type ContributeGoalMutation = UseMutationResult<void, ApiError, ContributeGoalPayload>;

type UseContributeGoalResult = ContributeGoalMutation & {
  cancel: () => void;
};

export function useContributeGoal(): UseContributeGoalResult {
  const queryClient = useQueryClient();
  const abortControllerRef = useRef<AbortController | null>(null);

  const mutation = useMutation<void, ApiError, ContributeGoalPayload>({
    mutationKey: ["goals", "contribute"],
    mutationFn: async ({ goalId, amount }) => {
      const normalizedGoalId = goalId.trim();
      if (!normalizedGoalId) {
        throw new ApiError("Goal id is required.", 400, "INVALID_RESPONSE");
      }

      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        await contributeGoalApi(normalizedGoalId, { amount }, { signal: controller.signal });
      } finally {
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
      }
    },
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: GOALS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: ["goal-detail", variables.goalId] }),
        queryClient.invalidateQueries({ queryKey: ["goal-history", variables.goalId] }),
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
