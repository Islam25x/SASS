import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import { ApiError } from "../../../infrastructure/api/api-error";
import { parseTransactionApi } from "../api/ai.api";
import { parseParsedTransaction } from "../utils/ai.parser";
import type { ParsedTransaction } from "../../transactions/utils/parsed-transaction.schema";

type UseParseTransactionOptions = {
  invalidateTransactions?: boolean;
  transactionsQueryKey?: readonly unknown[];
};

export function useParseTransaction(
  options?: UseParseTransactionOptions,
): UseMutationResult<ParsedTransaction, ApiError, string> {
  const queryClient = useQueryClient();

  return useMutation<ParsedTransaction, ApiError, string>({
    mutationFn: async (message) =>
      parseParsedTransaction(await parseTransactionApi(message)),
    onSuccess: async () => {
      if (!options?.invalidateTransactions || !options.transactionsQueryKey) {
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: [...options.transactionsQueryKey],
      });
    },
    retry: 0,
  });
}
