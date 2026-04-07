import { buildTransactionFromParsed } from "../../domain/transactions/transaction.rules";
import type { Transaction } from "../../domain/transactions/transaction.types";

export async function createTransactionUseCase(parsed: unknown): Promise<Transaction> {
  const id = String(Date.now());
  return buildTransactionFromParsed(parsed, { id });
}
