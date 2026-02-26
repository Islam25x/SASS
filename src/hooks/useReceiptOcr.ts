import { useEffect, useRef } from "react";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { ApiError, type ReceiptOcrResponse, receiptOcr } from "../services/ai.api";

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
        return await receiptOcr(file, { signal: controller.signal });
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
