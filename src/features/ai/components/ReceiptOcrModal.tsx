import { useCallback, useMemo, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, Upload, X } from "lucide-react";
import type { ReceiptOcrState } from "../../../hooks/useReceiptOcrFlow";
import type { Transaction } from "../../../domain/transactions/transaction.types";
import { Button, Input, Text } from "../../../shared/ui";

interface ReceiptOcrModalProps {
  isOpen: boolean;
  state: ReceiptOcrState;
  selectedFile: File | null;
  previewUrl: string | null;
  extractedTransactions: (Transaction & { type?: string; method?: "receipt" })[];
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
  onFileChange: (file: File | null) => void;
  onProcess: () => void;
  onConfirm: () => void;
}

const MODAL_TRANSITION = {
  duration: 0.22,
  ease: "easeOut",
} as const;

function ReceiptOcrModal({
  isOpen,
  state,
  selectedFile,
  previewUrl,
  extractedTransactions,
  isLoading,
  error,
  onClose,
  onFileChange,
  onProcess,
  onConfirm,
}: ReceiptOcrModalProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const pickFile = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleDrop = useCallback(
    (files: FileList | File[]) => {
      if (!files || files.length === 0) return;
      const file = files[0];
      if (!file.type.startsWith("image/")) return;
      onFileChange(file);
    },
    [onFileChange],
  );

  const statusLabel = useMemo(() => {
    if (state === "uploading") return "Uploading image...";
    if (state === "processing") return "Extracting transactions...";
    if (state === "preview") return "Review extracted transactions.";
    if (state === "error") return "Unable to extract transactions.";
    return "Upload a receipt image to extract transactions.";
  }, [state]);

  const showPreviewList =
    state === "preview" && extractedTransactions.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={MODAL_TRANSITION}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/35 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="receipt-ocr-title"
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={MODAL_TRANSITION}
            className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(event) => event.stopPropagation()}
          >
            {/* HEADER */}
            <header className="flex items-start justify-between border-b border-slate-100 p-6">
              <div>
                <Text
                  as="h2"
                  id="receipt-ocr-title"
                  variant="title"
                  weight="bold"
                  className="text-slate-900"
                >
                  Smart Receipt
                </Text>
                <Text variant="body" className="mt-2 text-slate-500">
                  {statusLabel}
                </Text>
              </div>
              <Button
                type="button"
                onClick={onClose}
                variant="ghost"
                size="sm"
                shape="circle"
                className="p-0 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Close Smart Receipt"
              >
                <X size={18} />
              </Button>
            </header>

            {/* BODY (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => handleDrop(event.target.files ?? [])}
              />

              {!previewUrl && (
                <div
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    handleDrop(event.dataTransfer.files);
                  }}
                  onClick={pickFile}
                  className="cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-5 text-center transition hover:border-primary/50 hover:bg-slate-100/70"
                >
                  <Upload size={20} className="mx-auto text-slate-500" />
                  <Text variant="body" weight="medium" className="mt-2 text-slate-700">
                    Drag and drop a receipt image
                  </Text>
                  <Text variant="caption" className="text-slate-500">
                    or click to browse
                  </Text>
                </div>
              )}

              {previewUrl && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex justify-center">
                  <img
                    src={previewUrl}
                    alt="Receipt preview"
                    className="h-40 w-auto object-contain rounded-lg shadow-sm"
                  />
                </div>
              )}

              {selectedFile && (
                <Text
                  as="p"
                  variant="caption"
                  className="truncate text-slate-600"
                  title={selectedFile.name}
                >
                  {selectedFile.name}
                </Text>
              )}

              {isLoading && (
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                  <Loader2 size={16} className="animate-spin" />
                  <Text as="span" variant="body" weight="medium" className="text-slate-700">
                    {state === "uploading"
                      ? "Uploading..."
                      : "Processing..."}
                  </Text>
                </div>
              )}

              {showPreviewList && (
                <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                    <CheckCircle2 size={16} />
                    <Text as="span" variant="body" weight="medium" className="text-emerald-700">
                      {extractedTransactions.length} extracted
                    </Text>
                  </div>

                  <ul className="max-h-42 space-y-2 overflow-auto pr-1 text-sm text-slate-700">
                    {extractedTransactions.map((transaction) => (
                      <li
                        key={transaction.id}
                        className="rounded-lg border border-slate-200 bg-white p-2"
                      >
                        <Text variant="body" weight="bold" className="text-slate-900">
                          {transaction.description}
                        </Text>
                        <Text variant="body">
                          {transaction.amount} | {transaction.category}
                        </Text>
                        <Text variant="body">
                          {transaction.transaction_type ??
                            transaction.type ??
                            "expense"}{" "}
                          | {transaction.date ?? "N/A"}
                        </Text>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  <Text variant="body" className="text-rose-700">
                    {error}
                  </Text>
                </div>
              )}
            </div>

            {/* FOOTER */}
            <footer className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/70 p-4">
              <Button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                variant="secondary"
                size="sm"
                className="rounded-xl border-slate-300 bg-white px-4 py-2 text-sm text-slate-700"
              >
                Cancel
              </Button>

              {!showPreviewList && (
                <Button
                  type="button"
                  onClick={onProcess}
                  disabled={!selectedFile || state === "processing"}
                  variant="primary"
                  size="sm"
                  className="rounded-xl px-4 py-2 text-sm"
                >
                  {state === "processing"
                    ? "Processing..."
                    : "Extract Transactions"}
                </Button>
              )}

              {showPreviewList && (
                <Button
                  type="button"
                  onClick={onConfirm}
                  disabled={isLoading}
                  variant="primary"
                  size="sm"
                  className="rounded-xl px-4 py-2 text-sm"
                >
                  Confirm Import
                </Button>
              )}
            </footer>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ReceiptOcrModal;
export type { ReceiptOcrModalProps };
