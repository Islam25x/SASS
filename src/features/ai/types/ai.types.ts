import { z } from "zod";
import type { TransactionResponseDto } from "../../transactions/types/transaction.dto";

export type ChatMessageRole = "user" | "assistant";

export interface ChatMessageDto {
  role: ChatMessageRole;
  content: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: ChatMessageRole;
  content: string;
  createdAt: string;
}

export interface ChatDto {
  title: string;
  messages: ChatMessageDto[];
}

export interface ChatConversation {
  title: string;
  messages: ChatMessage[];
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
export type ReceiptOcrItem = z.infer<typeof ReceiptOcrItemSchema>;
export type ReceiptOcrResponse = z.infer<typeof ReceiptOcrResponseSchema>;
