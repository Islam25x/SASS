import { useEffect, useRef } from "react";
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import { createCategoryUseCase } from "../features/transactions/application/create-category.usecase";
import type {
  CreateTransactionCategoryInput,
  TransactionCategory,
} from "../features/transactions/domain/category.types";
import { ApiError } from "../shared/api/api-error";
import { TRANSACTION_CATEGORIES_QUERY_KEY } from "./useCategories";

type CreateCategoryMutation = UseMutationResult<
  TransactionCategory | null,
  ApiError,
  CreateTransactionCategoryInput
>;

type UseCreateCategoryResult = CreateCategoryMutation & {
  cancel: () => void;
};

export function useCreateCategory(): UseCreateCategoryResult {
  const queryClient = useQueryClient();
  const abortControllerRef = useRef<AbortController | null>(null);

  const mutation = useMutation<
    TransactionCategory | null,
    ApiError,
    CreateTransactionCategoryInput
  >({
    mutationKey: ["transactions", "categories", "create"],
    mutationFn: async (payload) => {
      abortControllerRef.current?.abort();

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        return await createCategoryUseCase(payload, {
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
        queryKey: TRANSACTION_CATEGORIES_QUERY_KEY,
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
