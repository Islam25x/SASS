import { getAppApiBaseUrl } from "../../../infrastructure/api/api-config";
import { requestJson } from "../../../infrastructure/api/http";
import type { ReceiptOcrResponse } from "./ai.dto";
import type { ParsedTransaction } from "../../transactions/utils/parsed-transaction.schema";
import { parseReceiptOcrResponse, parseTransactionDraft } from "../utils/ai.parser";
export { createTransactionsFromSpeechApi } from "./parseTransactionFromSpeechApi";
export { voiceToTextApi } from "./voiceToTextApi";

export async function parseTransactionApi(
  message: string,
  options?: { signal?: AbortSignal },
): Promise<ParsedTransaction> {
  const response = await requestJson<unknown>("/api/AI/parse-transaction", {
    method: "POST",
    body: JSON.stringify({ text: message }),
    signal: options?.signal,
    baseUrl: getAppApiBaseUrl(),
    withAuth: true,
  });

  return parseTransactionDraft(response);
}

export async function receiptOcrApi(
  file: File,
  options?: { signal?: AbortSignal },
): Promise<ReceiptOcrResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await requestJson<unknown>("/api/AI/receipt-ocr", {
    method: "POST",
    body: formData,
    signal: options?.signal,
    baseUrl: getAppApiBaseUrl(),
    withAuth: true,
  });

  return parseReceiptOcrResponse(response);
}
