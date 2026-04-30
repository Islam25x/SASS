import { useEffect, useRef } from "react";
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import { ApiError } from "../../../infrastructure/api/api-error";
import { adjustBalanceApi } from "../api/adjust-balance.api";
import { DASHBOARD_QUERY_KEY } from "./useDashboard";

type AdjustBalanceResult = {
  message: string;
};

type UseAdjustBalanceResult = UseMutationResult<
  AdjustBalanceResult,
  ApiError,
  { targetBalance: number }
> & {
  cancel: () => void;
};

export function useAdjustBalance(): UseAdjustBalanceResult {
  const queryClient = useQueryClient();
  const abortControllerRef = useRef<AbortController | null>(null);

  const mutation = useMutation<AdjustBalanceResult, ApiError, { targetBalance: number }>({
    mutationKey: ["dashboard", "adjust-balance"],
    mutationFn: async ({ targetBalance }) => {
      if (!Number.isFinite(targetBalance)) {
        throw new ApiError("A valid balance is required.", 400, "INVALID_RESPONSE");
      }

      abortControllerRef.current?.abort();

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const response = await adjustBalanceApi(
          {
            targetBalance,
          },
          { signal: controller.signal },
        );

        return {
          message: response.message?.trim() || "Balance adjusted successfully",
        };
      } finally {
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
      }
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: DASHBOARD_QUERY_KEY,
        }),
        queryClient.invalidateQueries({
          queryKey: ["transactions"],
        }),
      ]);
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
