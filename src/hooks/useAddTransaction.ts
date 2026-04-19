import { useEffect, useRef } from "react";
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import { addTransactionUseCase } from "../features/transactions/application/add-transaction.usecase";
import type { AddTransactionInput } from "../features/transactions/domain/add-transaction.types";
import { ApiError } from "../shared/api/api-error";

type AddTransactionMutation = UseMutationResult<void, ApiError, AddTransactionInput>;

type UseAddTransactionResult = AddTransactionMutation & {
  cancel: () => void;
};

export function useAddTransaction(): UseAddTransactionResult {
  const queryClient = useQueryClient();
  const abortControllerRef = useRef<AbortController | null>(null);

  const mutation = useMutation<void, ApiError, AddTransactionInput>({
    mutationKey: ["transactions", "add"],
    mutationFn: async (payload) => {
      abortControllerRef.current?.abort();

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        return await addTransactionUseCase(payload, { signal: controller.signal });
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
