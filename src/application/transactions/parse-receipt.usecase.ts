import { ApiError } from "../../shared/api/api-error";
import { receiptOcrApi } from "../../infrastructure/api/ai.api";
import { parseReceiptOcrResponse } from "../../domain/ai/ai.rules";
import type { ReceiptOcrResponse } from "../../domain/ai/ai.types";

export async function parseReceiptUseCase(
  file: File,
  options?: { signal?: AbortSignal },
): Promise<ReceiptOcrResponse> {
  const payload = await receiptOcrApi(file, options);

  try {
    const parsed = parseReceiptOcrResponse(payload);
    return {
      ...parsed,
      issued_at: parsed.issued_at ?? new Date().toISOString(),
    };
  } catch (error) {
    throw new ApiError("Invalid receipt OCR response.", 500, "INVALID_RESPONSE", undefined, error);
  }
}
