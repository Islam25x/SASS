import { buildTransactionFromParsed } from "../../features/transactions/domain/transaction.rules";
import type { Transaction } from "../../features/transactions/domain/transaction.types";

export async function createTransactionUseCase(parsed: unknown): Promise<Transaction> {
  const id = String(Date.now());
  return buildTransactionFromParsed(parsed, { id });
}
