import {
  ReceiptOcrResponseSchema,
  VoiceToTextResponseSchema,
  type ReceiptOcrResponse,
  type VoiceToTextResponse,
} from "../api/ai.dto";
import {
  parseParsedTransaction as parseTransactionPayload,
  type ParsedTransaction,
} from "../../transactions/utils/parsed-transaction.schema";

export function parseVoiceToTextResponse(payload: unknown): VoiceToTextResponse {
  return VoiceToTextResponseSchema.parse(payload);
}

export function parseParsedTransaction(payload: unknown): ParsedTransaction {
  return parseTransactionPayload(payload);
}

export function parseReceiptOcrResponse(payload: unknown): ReceiptOcrResponse {
  return ReceiptOcrResponseSchema.parse(payload);
}
