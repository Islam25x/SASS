import { z } from "zod";
import { ParsedTransactionSchema } from "../ai/ai.schema";

export const TransactionSchema = z.object({
  id: z.string().min(1),
  amount: z.number().finite(),
  category: z.string().min(1),
  description: z.string().min(1),
  date: z.string().optional(),
  transaction_type: z.string().optional(),
  type: z.string().optional(),
  method: z.enum(["voice", "receipt"]).optional(),
});

export const TransactionListSchema = z.array(TransactionSchema);
export const ParsedTransactionForLedgerSchema = ParsedTransactionSchema;

export type Transaction = z.infer<typeof TransactionSchema>;
