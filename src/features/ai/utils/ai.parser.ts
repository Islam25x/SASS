import {
  CreateTransactionsFromSpeechResponseSchema,
  ParseTransactionsFromSpeechRequestSchema,
  ReceiptOcrResponseSchema,
  VoiceToTextResponseSchema,
  type CreateTransactionsFromSpeechResponseDto,
  type ParseTransactionsFromSpeechRequestDto,
  type ReceiptOcrResponse,
  type VoiceToTextResponse,
} from "../api/ai.dto";
import {
  parseParsedTransaction as parseTransactionDraftPayload,
  type ParsedTransaction,
} from "../../transactions/utils/parsed-transaction.schema";

export function parseVoiceToTextResponse(payload: unknown): VoiceToTextResponse {
  return VoiceToTextResponseSchema.parse(payload);
}

export function parseTransactionDraft(payload: unknown): ParsedTransaction {
  return parseTransactionDraftPayload(payload);
}

export function parseParsedTransaction(payload: unknown): ParsedTransaction {
  return parseTransactionDraft(payload);
}

export function parseCreateTransactionsFromSpeechRequest(
  payload: unknown,
): ParseTransactionsFromSpeechRequestDto {
  return ParseTransactionsFromSpeechRequestSchema.parse(payload);
}

export function parseCreateTransactionsFromSpeechResponse(
  payload: unknown,
): CreateTransactionsFromSpeechResponseDto {
  return CreateTransactionsFromSpeechResponseSchema.parse(payload);
}

export function parseReceiptOcrResponse(payload: unknown): ReceiptOcrResponse {
  return ReceiptOcrResponseSchema.parse(payload);
}
