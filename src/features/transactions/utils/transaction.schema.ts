import { z } from "zod";
import { ParsedTransactionSchema } from "../../ai/types/ai.types";

export const TransactionSchema = z.object({
  id: z.string().min(1),
  amount: z.number().finite(),
  category: z.string().min(1),
  description: z.string().min(1),
  date: z.string().optional(),
  type: z.enum(["Income", "Expense"]),
  method: z.enum(["voice", "receipt"]).optional(),
});

export const TransactionListSchema = z.array(TransactionSchema);
export const ParsedTransactionForLedgerSchema = ParsedTransactionSchema;

export type Transaction = z.infer<typeof TransactionSchema>;
