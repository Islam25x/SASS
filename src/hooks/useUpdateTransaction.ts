import { useEffect, useRef } from "react";
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import { updateTransactionUseCase } from "../features/transactions/application/update-transaction.usecase";
import type { AddTransactionInput } from "../features/transactions/types/add-transaction.types";
import { ApiError } from "../shared/api/api-error";

type UpdateTransactionPayload = {
  transactionId: string;
  input: AddTransactionInput;
};

type UpdateTransactionMutation = UseMutationResult<
  void,
  ApiError,
  UpdateTransactionPayload
>;

type UseUpdateTransactionResult = UpdateTransactionMutation & {
  cancel: () => void;
};

export function useUpdateTransaction(): UseUpdateTransactionResult {
  const queryClient = useQueryClient();
  const abortControllerRef = useRef<AbortController | null>(null);

  const mutation = useMutation<void, ApiError, UpdateTransactionPayload>({
    mutationKey: ["transactions", "update"],
    mutationFn: async ({ transactionId, input }) => {
      abortControllerRef.current?.abort();

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        return await updateTransactionUseCase(transactionId, input, {
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
        queryKey: ["transactions"],
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
