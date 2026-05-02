import { z } from "zod";
import type { TransactionResponseDto } from "../../transactions/api/transaction.dto";
import type { ChatMessageRole } from "../types/ai.types";

export interface ChatMessageDto {
  role: ChatMessageRole;
  content: string;
  createdAt: string;
}

export interface ChatDto {
  title: string;
  messages: ChatMessageDto[];
}

export interface SendChatMessageDto {
  message: string;
}

export interface SendChatMessageResponseDto {
  sessionId: string;
  reply: string;
  transactions: TransactionResponseDto[];
}

export const VoiceToTextResponseSchema = z.object({
  text: z.string(),
});

export const ParseTransactionsFromSpeechRequestSchema = z.object({
  text: z.string().trim().min(1),
});

export const CreateTransactionsFromSpeechResponseSchema = z.object({
  message: z.string(),
  count: z.number().int().nonnegative(),
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

export interface VoiceToTextRequestDto {
  file: File;
}

export interface VoiceToTextResponseDto {
  text: string;
}
export type VoiceToTextResponse = z.infer<typeof VoiceToTextResponseSchema>;
export type ParseTransactionsFromSpeechRequestDto = z.infer<
  typeof ParseTransactionsFromSpeechRequestSchema
>;
export type CreateTransactionsFromSpeechResponseDto = z.infer<
  typeof CreateTransactionsFromSpeechResponseSchema
>;
export type ReceiptOcrItem = z.infer<typeof ReceiptOcrItemSchema>;
export type ReceiptOcrResponse = z.infer<typeof ReceiptOcrResponseSchema>;
