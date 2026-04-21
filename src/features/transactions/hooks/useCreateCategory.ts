import { useEffect, useRef } from "react";
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import { createCategoryApi } from "../api/create-category.api";
import type {
  CreateTransactionCategoryInput,
  TransactionCategory,
} from "../types/category.types";
import { parseCreatedCategory } from "../utils/category.parser";
import { ApiError } from "../../../shared/api/api-error";
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
      const name = payload.name.trim();

      if (!name) {
        throw new ApiError("Category name is required.", 400, "INVALID_RESPONSE");
      }

      abortControllerRef.current?.abort();

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const response = await createCategoryApi(
          {
            name,
            type: payload.type,
          },
          { signal: controller.signal },
        );

        return parseCreatedCategory(response);
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
