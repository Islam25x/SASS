import { z } from "zod";

export const VoiceToTextResponseSchema = z.object({
  text: z.string(),
});

export const ParsedTransactionSchema = z.object({
  amount: z.number().finite(),
  currency: z.string().optional(),
  merchant: z.string().optional(),
  category: z.string().min(1),
  transaction_type: z.string().optional(),
  date: z.string().optional(),
  description: z.string().min(1),
});

export const ReceiptOcrItemSchema = z.object({
  name: z.string().optional(),
  line_total: z.number().finite().optional(),
  unit_price: z.number().finite().optional(),
  quantity: z.number().finite().optional(),
});

export const ReceiptOcrResponseSchema = z.object({
  items: z.array(ReceiptOcrItemSchema),
  merchant: z.string().optional(),
  issued_at: z.string().optional(),
});

export type VoiceToTextResponse = z.infer<typeof VoiceToTextResponseSchema>;
export type ParsedTransaction = z.infer<typeof ParsedTransactionSchema>;
export type ReceiptOcrItem = z.infer<typeof ReceiptOcrItemSchema>;
export type ReceiptOcrResponse = z.infer<typeof ReceiptOcrResponseSchema>;
