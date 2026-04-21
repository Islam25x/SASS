import { useEffect, useRef } from "react";
import {
  useMutation,
  useQueryClient,
  type QueryKey,
  type UseMutationResult,
} from "@tanstack/react-query";
import { z } from "zod";
import { parseTransactionApi } from "../api/ai.api";
import type { ParsedTransaction } from "../types/ai.types";
import { parseParsedTransaction } from "../utils/ai.parser";
import { ApiError } from "../../../shared/api/api-error";

const ParseTransactionInputSchema = z.string().min(1);
const DEFAULT_TRANSACTIONS_QUERY_KEY: QueryKey = ["transactions"];

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

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
  const queryClient = useQueryClient();
  const abortControllerRef = useRef<AbortController | null>(null);

  const mutation = useMutation<ParsedTransaction, ApiError, string>({
    mutationKey: ["ai", "parse-transaction"],
    mutationFn: async (text) => {
      abortControllerRef.current?.abort();

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        ParseTransactionInputSchema.parse(text);

        const payload = await parseTransactionApi(text, { signal: controller.signal });

        if (isObject(payload) && isObject(payload.transaction)) {
          return parseParsedTransaction(payload.transaction);
        }

        return parseParsedTransaction(payload);
      } catch (error) {
        throw new ApiError(
          "Invalid transaction payload received.",
          500,
          "INVALID_RESPONSE",
          undefined,
          error,
        );
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
