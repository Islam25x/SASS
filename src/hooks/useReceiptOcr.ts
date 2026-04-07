import { useEffect, useRef } from "react";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { parseReceiptUseCase } from "../application/transactions/parse-receipt.usecase";
import type { ReceiptOcrResponse } from "../domain/ai/ai.types";
import { ApiError } from "../infrastructure/api/api-error";

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
        return await parseReceiptUseCase(file, { signal: controller.signal });
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
