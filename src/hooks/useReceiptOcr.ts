import { useEffect, useRef } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryKey,
  type UseMutationResult,
} from "@tanstack/react-query";
import {
  ApiError,
  type ReceiptOcrResponse,
  receiptOcr,
} from "../services/ai.api";

const DEFAULT_PREVIEW_QUERY_KEY: QueryKey = ["ai", "receipt-ocr", "preview"];

type ReceiptOcrMutation = UseMutationResult<ReceiptOcrResponse, ApiError, File>;

interface UseReceiptOcrOptions {
  previewQueryKey?: QueryKey;
}

type UseReceiptOcrResult = ReceiptOcrMutation & {
  preview: ReceiptOcrResponse | null;
  clearPreview: () => void;
  cancel: () => void;
};

export function useReceiptOcr(options?: UseReceiptOcrOptions): UseReceiptOcrResult {
  // Stores OCR preview in query cache so UI can render progressively and reset cleanly.
  const queryClient = useQueryClient();
  const abortControllerRef = useRef<AbortController | null>(null);
  const previewQueryKey = options?.previewQueryKey ?? DEFAULT_PREVIEW_QUERY_KEY;

  const mutation = useMutation<
    ReceiptOcrResponse,
    ApiError,
    File,
    { previousPreview: ReceiptOcrResponse | null | undefined }
  >({
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
    onMutate: async (): Promise<{
      previousPreview: ReceiptOcrResponse | null | undefined;
    }> => {
      await queryClient.cancelQueries({ queryKey: previewQueryKey });
      const previousPreview = queryClient.getQueryData<ReceiptOcrResponse | null>(
        previewQueryKey,
      );

      queryClient.setQueryData<ReceiptOcrResponse>(previewQueryKey, {
        transactions: [],
      });

      return { previousPreview };
    },
    onSuccess: (data) => {
      queryClient.setQueryData<ReceiptOcrResponse>(previewQueryKey, data);
    },
    onError: (_error, _file, context) => {
      queryClient.setQueryData(previewQueryKey, context?.previousPreview ?? null);
    },
    retry: 1,
  });

  const previewQuery = useQuery({
    queryKey: previewQueryKey,
    queryFn: async () => null as ReceiptOcrResponse | null,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return {
    ...mutation,
    preview: previewQuery.data ?? null,
    clearPreview: () => queryClient.removeQueries({ queryKey: previewQueryKey }),
    cancel: () => abortControllerRef.current?.abort(),
  };
}
