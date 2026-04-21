import { buildTransactionFromParsed } from "../../features/transactions/utils/transaction.parser";
import type { Transaction } from "../../features/transactions/types/transaction.types";

export async function createTransactionUseCase(parsed: unknown): Promise<Transaction> {
  const id = String(Date.now());
  return buildTransactionFromParsed(parsed, { id });
}
