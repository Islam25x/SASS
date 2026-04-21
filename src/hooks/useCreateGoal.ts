import { useEffect, useRef } from "react";
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import {
  createGoalUseCase,
  type CreateGoalFormInput,
} from "../features/goals/application/create-goal.usecase";
import { ApiError } from "../shared/api/api-error";
import { GOALS_QUERY_KEY } from "./useGoals";

type CreateGoalMutation = UseMutationResult<void, ApiError, CreateGoalFormInput>;

type UseCreateGoalResult = CreateGoalMutation & {
  cancel: () => void;
};

export function useCreateGoal(): UseCreateGoalResult {
  const queryClient = useQueryClient();
  const abortControllerRef = useRef<AbortController | null>(null);

  const mutation = useMutation<void, ApiError, CreateGoalFormInput>({
    mutationKey: ["goals", "create"],
    mutationFn: async (payload) => {
      abortControllerRef.current?.abort();

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        return await createGoalUseCase(payload, {
          signal: controller.signal,
        });
      } finally {
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: GOALS_QUERY_KEY,
      });
    },
    retry: 0,
  });

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return {
    ...mutation,
    cancel: () => abortControllerRef.current?.abort(),
  };
}
