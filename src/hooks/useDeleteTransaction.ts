import { useEffect, useRef } from "react";
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import { deleteTransactionUseCase } from "../features/transactions/application/delete-transaction.usecase";
import { ApiError } from "../shared/api/api-error";

type DeleteTransactionMutation = UseMutationResult<void, ApiError, string>;

type UseDeleteTransactionResult = DeleteTransactionMutation & {
  cancel: () => void;
};

export function useDeleteTransaction(): UseDeleteTransactionResult {
  const queryClient = useQueryClient();
  const abortControllerRef = useRef<AbortController | null>(null);

  const mutation = useMutation<void, ApiError, string>({
    mutationKey: ["transactions", "delete"],
    mutationFn: async (transactionId) => {
      abortControllerRef.current?.abort();

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        return await deleteTransactionUseCase(transactionId, {
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
