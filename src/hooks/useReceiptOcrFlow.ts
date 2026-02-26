import { useCallback, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { type Transaction } from "../services/ai.api";
import { useReceiptOcr } from "./useReceiptOcr";

export type ReceiptOcrState =
  | "idle"
  | "uploading"
  | "processing"
  | "preview"
  | "error";

interface ReceiptOcrUiTransaction extends Transaction {
  quantity: number;
  issued_at: string;
  type: "expense";
  transaction_type: "expense";
  method: "receipt";
}

interface UseReceiptOcrFlowOptions {
  onComplete?: () => void;
}

interface UseReceiptOcrFlowResult {
  state: ReceiptOcrState;
  selectedFile: File | null;
  previewUrl: string | null;
  extractedTransactions: ReceiptOcrUiTransaction[];
  isLoading: boolean;
  error: string | null;
  handleFile: (file: File | null) => void;
  processReceipt: () => Promise<void>;
  confirmTransactions: () => void;
  cancel: () => void;
}

export function useReceiptOcrFlow(
  options?: UseReceiptOcrFlowOptions,
): UseReceiptOcrFlowResult {
  const queryClient = useQueryClient();
  const receiptOcrMutation = useReceiptOcr();

  const [state, setState] = useState<ReceiptOcrState>("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [extractedTransactions, setExtractedTransactions] = useState<
    ReceiptOcrUiTransaction[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File | null) => {
      setExtractedTransactions([]);
      setError(null);
      receiptOcrMutation.reset();

      if (!file) {
        setSelectedFile(null);
        setPreviewUrl((previous) => {
          if (previous) {
            URL.revokeObjectURL(previous);
          }
          return null;
        });
        setState("idle");
        return;
      }

      const url = URL.createObjectURL(file);
      setPreviewUrl((previous) => {
        if (previous) {
          URL.revokeObjectURL(previous);
        }
        return url;
      });
      setSelectedFile(file);
      setState("idle");
    },
    [receiptOcrMutation],
  );

  const processReceipt = useCallback(async () => {
    if (!selectedFile || receiptOcrMutation.isPending) {
      return;
    }

    setError(null);
    setState("uploading");

    try {
      setState("processing");
      const data = await receiptOcrMutation.mutateAsync(selectedFile);

      if (!data || !Array.isArray(data.items)) {
        setState("error");
        setError("Invalid receipt OCR response structure.");
        return;
      }

      const normalized = data.items.map((item, index) => ({
        id: typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}-${index}`,
        description: item.name ?? data.merchant ?? "Receipt item",
        amount: item.line_total ?? item.unit_price ?? 0,
        quantity: item.quantity ?? 1,
        category: "Receipt",
        date: data.issued_at ?? new Date().toISOString(),
        type: "expense" as const,
        transaction_type: "expense" as const,
        method: "receipt" as const,
        issued_at: data.issued_at ?? new Date().toISOString(),
      }));

      setExtractedTransactions(normalized);
      setState("preview");
    } catch (errorValue) {
      setState("error");
      setError(errorValue instanceof Error ? errorValue.message : "OCR failed.");
    }
  }, [receiptOcrMutation, selectedFile]);

  const cancel = useCallback(() => {
    receiptOcrMutation.cancel();
    receiptOcrMutation.reset();
    setSelectedFile(null);
    setPreviewUrl((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous);
      }
      return null;
    });
    setExtractedTransactions([]);
    setError(null);
    setState("idle");
  }, [receiptOcrMutation]);

  const confirmTransactions = useCallback(() => {
    if (state !== "preview" || extractedTransactions.length === 0) {
      return;
    }

    queryClient.setQueryData(["transactions"], (old: any[] = []) => [
      ...extractedTransactions,
      ...old,
    ]);

    options?.onComplete?.();
    cancel();
  }, [cancel, extractedTransactions, options, queryClient, state]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      receiptOcrMutation.cancel();
    };
  }, [previewUrl, receiptOcrMutation]);

  const isLoading = useMemo(
    () => state === "uploading" || state === "processing",
    [state],
  );

  return {
    state,
    selectedFile,
    previewUrl,
    extractedTransactions,
    isLoading,
    error,
    handleFile,
    processReceipt,
    confirmTransactions,
    cancel,
  };
}
