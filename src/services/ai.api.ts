import { parseTransactionUseCase } from "../application/ai/parse-transaction.usecase";
import { sendChatMessageUseCase } from "../application/ai/send-chat-message.usecase";
import { voiceToTextUseCase } from "../application/ai/voice-to-text.usecase";
import { fetchTransactionsUseCase } from "../application/transactions/fetch-transactions.usecase";
import { parseReceiptUseCase } from "../application/transactions/parse-receipt.usecase";
import type {
  ParsedTransaction,
  ReceiptOcrItem,
  ReceiptOcrResponse,
  VoiceToTextResponse,
} from "../domain/ai/ai.types";
import type { Transaction } from "../features/transactions/domain/transaction.types";
import { readStoredAuthSession } from "../infrastructure/auth/auth-storage";
export { ApiError } from "../shared/api/api-error";
import type { TransactionsFilters } from "../features/transactions/domain/transactions-filter.types";

export type {
  ParsedTransaction,
  ReceiptOcrItem,
  ReceiptOcrResponse,
  Transaction,
  VoiceToTextResponse,
};

export async function voiceToText(
  blob: Blob,
  options?: { signal?: AbortSignal },
): Promise<VoiceToTextResponse> {
  return voiceToTextUseCase(blob, options);
}

export async function parseTransaction(
  text: string,
  options?: { signal?: AbortSignal },
): Promise<ParsedTransaction> {
  return parseTransactionUseCase(text, options);
}

export async function receiptOcr(
  file: File,
  options?: { signal?: AbortSignal },
): Promise<ReceiptOcrResponse> {
  return parseReceiptUseCase(file, options);
}

export async function fetchTransactions(
  filters?: TransactionsFilters,
  options?: { signal?: AbortSignal },
): Promise<Transaction[]> {
  const session = readStoredAuthSession();

  return fetchTransactionsUseCase(
    {
      accessToken: session?.token,
      filters,
    },
    options,
  );
}

export async function sendChatbotMessage(
  message: string,
  options?: { signal?: AbortSignal },
): Promise<Response> {
  return sendChatMessageUseCase(message, options);
}
