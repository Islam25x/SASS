import { useEffect, useRef } from "react";
import {
  useMutation,
  useQueryClient,
  type QueryKey,
  type UseMutationResult,
} from "@tanstack/react-query";
import {
  parseTransactionUseCase,
} from "../application/ai/parse-transaction.usecase";
import type { ParsedTransaction } from "../domain/ai/ai.types";
import {
  ApiError,
} from "../shared/api/api-error";

const DEFAULT_TRANSACTIONS_QUERY_KEY: QueryKey = ["transactions"];

type ParseTransactionMutation = UseMutationResult<
  ParsedTransaction,
  ApiError,
  string
>;

interface UseParseTransactionOptions {
  invalidateTransactions?: boolean;
  transactionsQueryKey?: QueryKey;
}

type UseParseTransactionResult = ParseTransactionMutation & {
  cancel: () => void;
};

export function useParseTransaction(
  options?: UseParseTransactionOptions,
): UseParseTransactionResult {
  // Keeps parsing side-effects close to data-layer concerns (cache invalidation).
  const queryClient = useQueryClient();
  const abortControllerRef = useRef<AbortController | null>(null);

  const mutation = useMutation<ParsedTransaction, ApiError, string>({
    mutationKey: ["ai", "parse-transaction"],
    mutationFn: async (text) => {
      abortControllerRef.current?.abort();

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        return await parseTransactionUseCase(text, { signal: controller.signal });
      } finally {
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
      }
    },
    onSuccess: async () => {
      if (!options?.invalidateTransactions) {
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: options.transactionsQueryKey ?? DEFAULT_TRANSACTIONS_QUERY_KEY,
      });
    },
    retry: 1,
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
