import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { ApiError } from "../../../infrastructure/api/api-error";
import { receiptOcrApi } from "../api/ai.api";
import { parseReceiptOcrResponse } from "../utils/ai.parser";
import type { ReceiptOcrResponse } from "../types/ai.types";

export function useReceiptOcr(): UseMutationResult<
  ReceiptOcrResponse,
  ApiError,
  File
> {
  return useMutation<ReceiptOcrResponse, ApiError, File>({
    mutationFn: async (file) => parseReceiptOcrResponse(await receiptOcrApi(file)),
    retry: 0,
  });
}
