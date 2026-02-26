import { useCallback, useMemo, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, Upload, X } from "lucide-react";
import type { ReceiptOcrState } from "../../../hooks/useReceiptOcrFlow";
import type { Transaction } from "../../../services/ai.api";

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
                <h2
                  id="receipt-ocr-title"
                  className="text-2xl font-semibold text-slate-900"
                >
                  Smart Receipt
                </h2>
                <p className="mt-2 text-sm text-slate-500">{statusLabel}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                aria-label="Close Smart Receipt"
              >
                <X size={18} />
              </button>
            </header>

            {/* BODY (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <input
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
                  <p className="mt-2 text-sm font-medium text-slate-700">
                    Drag and drop a receipt image
                  </p>
                  <p className="text-xs text-slate-500">
                    or click to browse
                  </p>
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
                <p
                  className="truncate text-xs text-slate-600"
                  title={selectedFile.name}
                >
                  {selectedFile.name}
                </p>
              )}

              {isLoading && (
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                  <Loader2 size={16} className="animate-spin" />
                  <span>
                    {state === "uploading"
                      ? "Uploading..."
                      : "Processing..."}
                  </span>
                </div>
              )}

              {showPreviewList && (
                <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                    <CheckCircle2 size={16} />
                    <span>
                      {extractedTransactions.length} extracted
                    </span>
                  </div>

                  <ul className="max-h-42 space-y-2 overflow-auto pr-1 text-sm text-slate-700">
                    {extractedTransactions.map((transaction) => (
                      <li
                        key={transaction.id}
                        className="rounded-lg border border-slate-200 bg-white p-2"
                      >
                        <p className="font-semibold text-slate-900">
                          {transaction.description}
                        </p>
                        <p>
                          {transaction.amount} | {transaction.category}
                        </p>
                        <p>
                          {transaction.transaction_type ??
                            transaction.type ??
                            "expense"}{" "}
                          | {transaction.date ?? "N/A"}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {error}
                </div>
              )}
            </div>

            {/* FOOTER */}
            <footer className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/70 p-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              {!showPreviewList && (
                <button
                  type="button"
                  onClick={onProcess}
                  disabled={!selectedFile || state === "processing"}
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {state === "processing"
                    ? "Processing..."
                    : "Extract Transactions"}
                </button>
              )}

              {showPreviewList && (
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Confirm Import
                </button>
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