import type { ReceiptOcrResponse } from "../../domain/ai/ai.types";
import { buildTransactionsFromReceipt } from "../../features/transactions/utils/transaction.parser";
import type { Transaction } from "../../features/transactions/types/transaction.types";

export async function normalizeReceiptTransactionsUseCase(
  response: ReceiptOcrResponse,
): Promise<Transaction[]> {
  const issuedAt = response.issued_at ?? new Date().toISOString();
  const ids = response.items.map((_, index) =>
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${index}`,
  );

  return buildTransactionsFromReceipt(response, { issuedAt, ids });
}
