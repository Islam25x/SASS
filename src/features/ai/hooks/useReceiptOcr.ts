import { useEffect, useRef } from "react";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { receiptOcrApi } from "../api/ai.api";
import type { ReceiptOcrResponse } from "../types/ai.types";
import { parseReceiptOcrResponse } from "../utils/ai.parser";
import { ApiError } from "../../../shared/api/api-error";

type ReceiptOcrMutation = UseMutationResult<ReceiptOcrResponse, ApiError, File>;

type UseReceiptOcrResult = ReceiptOcrMutation & {
  cancel: () => void;
};

export function useReceiptOcr(): UseReceiptOcrResult {
  const abortControllerRef = useRef<AbortController | null>(null);

  const mutation = useMutation<ReceiptOcrResponse, ApiError, File>({
    mutationKey: ["ai", "receipt-ocr"],
    mutationFn: async (file) => {
      abortControllerRef.current?.abort();

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const payload = await receiptOcrApi(file, { signal: controller.signal });
        const parsed = parseReceiptOcrResponse(payload);

        return {
          ...parsed,
          issued_at: parsed.issued_at ?? new Date().toISOString(),
        };
      } catch (error) {
        throw new ApiError("Invalid receipt OCR response.", 500, "INVALID_RESPONSE", undefined, error);
      } finally {
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
      }
    },
    retry: 1,
  });

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return {
    ...mutation,
    cancel: () => abortControllerRef.current?.abort(),
  };
}
