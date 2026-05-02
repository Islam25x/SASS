import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { ApiError } from "../../../infrastructure/api/api-error";
import { receiptOcrApi } from "../api/ai.api";
import type { ReceiptOcrResponse } from "../api/ai.dto";

export function useReceiptOcr(): UseMutationResult<
  ReceiptOcrResponse,
  ApiError,
  File
> {
  return useMutation<ReceiptOcrResponse, ApiError, File>({
    mutationFn: async (file) => receiptOcrApi(file),
    retry: 0,
  });
}
