import { useEffect, useRef } from "react";
import { CheckCircle2, Mic, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { ParsedTransaction } from "../types/ai.types";
import type { VoiceLedgerState } from "../hooks/useVoiceLedgerFlow";
import { Button, Input, Text } from "../../../shared/ui";

interface VoiceLedgerModalProps {
  isOpen: boolean;
  state: VoiceLedgerState;
  transcript: string;
  parsedTransaction: ParsedTransaction | null;
  error: string | null;
  isLoading: boolean;
  onClose: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onConfirm: () => void;
  onTranscriptChange: (value: string) => void;
}

const MODAL_TRANSITION = {
  duration: 0.22,
  ease: "easeOut",
} as const;

function VoiceLedgerModal({
  isOpen,
  state,
  transcript,
  parsedTransaction,
  error,
  isLoading,
  onClose,
  onStartRecording,
  onStopRecording,
  onConfirm,
  onTranscriptChange,
}: VoiceLedgerModalProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (isOpen && (state === "transcribed" || state === "preview")) {
      textareaRef.current?.focus();
    }
  }, [isOpen, state]);

  const isRecordingLike =
    state === "recording" || state === "transcribing" || state === "parsing";
  const showPreview =
    state === "transcribed" || state === "preview" || state === "submitting";

  const statusLabel =
    state === "recording"
      ? "Listening..."
      : state === "transcribing"
        ? "Transcribing..."
        : state === "parsing"
          ? "Parsing transaction..."
          : "Tap the mic to start recording";

          
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
            aria-labelledby="voice-ledger-title"
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={MODAL_TRANSITION}
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex items-start justify-between border-b border-slate-100 p-6">
              <div>
                <Text as="h2" variant="title" weight="bold" id="voice-ledger-title" className="text-slate-900">
                  Voice Ledger
                </Text>
                <Text variant="body" className="mt-2 text-slate-500">
                  Press record and speak to capture a transaction...
                </Text>
              </div>
              <Button
                type="button"
                onClick={onClose}
                variant="ghost"
                size="sm"
                shape="circle"
                className="p-0 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Close Voice Ledger"
              >
                <X size={18} />
              </Button>
            </header>

            <div className="space-y-4 p-6">
              {!showPreview && (
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <motion.span
                      aria-hidden="true"
                      animate={{ scale: [1, 1.22, 1], opacity: [0.24, 0.1, 0.24] }}
                      transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
                      className={`absolute inset-0 rounded-full ${
                        state === "recording" ? "bg-red-500" : "bg-primary"
                      }`}
                    />
                    {(() => {
                      const MotionButton = motion(Button);
                      return (
                        <MotionButton
                      type="button"
                      onClick={state === "recording" ? onStopRecording : onStartRecording}
                      whileTap={{ scale: 0.96 }}
                      animate={isRecordingLike ? { scale: [1, 1.03, 1] } : { scale: 1 }}
                      transition={
                        isRecordingLike
                          ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
                          : { duration: 0.15 }
                      }
                      variant="primary"
                      size="lg"
                      shape="circle"
                      className={`relative z-10 flex h-24 w-24 items-center justify-center rounded-full text-white shadow-lg p-0 ${
                        state === "recording" ? "bg-red-500" : "bg-primary"
                      }`}
                    >
                      <Mic size={30} strokeWidth={2.4} />
                    </MotionButton>
                      );
                    })()}
                  </div>

                  {isRecordingLike && (
                    <div className="flex items-center gap-1.5" aria-hidden="true">
                      {[0, 1, 2, 3, 4].map((bar) => (
                        <motion.span
                          key={bar}
                          animate={{ scaleY: [0.5, 1, 0.6, 1.15, 0.5] }}
                          transition={{
                            duration: 0.9,
                            repeat: Infinity,
                            delay: bar * 0.08,
                            ease: "easeInOut",
                          }}
                          className="h-6 w-1.5 origin-bottom rounded-full bg-red-400"
                        />
                      ))}
                    </div>
                  )}

                  <Text variant="body" weight="medium" className="text-slate-700">
                    {statusLabel}
                  </Text>
                </div>
              )}

              {showPreview && (
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                    <CheckCircle2 size={16} />
                    <Text as="span" variant="body" weight="medium" className="text-emerald-700">
                      Transcribed
                    </Text>
                  </div>
                  <Input
                    as="textarea"
                    ref={textareaRef}
                    value={transcript}
                    onChange={(event) => onTranscriptChange(event.target.value)}
                    placeholder="Review and edit your transcribed transaction..."
                    className="min-h-28 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700"
                    disabled={state === "submitting"}
                  />
                  {parsedTransaction && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                      <Text variant="body" weight="bold" className="text-slate-900">
                        Structured Preview
                      </Text>
                      <Text variant="body" className="mt-1">
                        Amount: {parsedTransaction.amount}
                      </Text>
                      <Text variant="body">Category: {parsedTransaction.category}</Text>
                      <Text variant="body">
                        Description: {parsedTransaction.description}
                      </Text>
                      <Text variant="body">Date: {parsedTransaction.date ?? "N/A"}</Text>
                    </div>
                  )}
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

            <footer className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/70 p-4">
              {state !== "idle" && (
                <Button
                  type="button"
                  onClick={onClose}
                  disabled={state === "submitting"}
                  variant="secondary"
                  size="sm"
                  className="rounded-xl border-slate-300 bg-white px-4 py-2 text-sm text-slate-700"
                >
                  Cancel
                </Button>
              )}

              {state === "recording" && (
                <Button
                  type="button"
                  onClick={onStopRecording}
                  disabled={isLoading}
                  variant="danger"
                  size="sm"
                  className="rounded-xl px-4 py-2 text-sm"
                >
                  Stop Recording
                </Button>
              )}

              {(state === "transcribed" || state === "preview" || state === "submitting") && (
                <Button
                  type="button"
                  onClick={onConfirm}
                  disabled={(state !== "transcribed" && state !== "preview") || isLoading}
                  variant="primary"
                  size="sm"
                  className="rounded-xl px-4 py-2 text-sm"
                >
                  {state === "submitting" ? "Confirming..." : "Confirm"}
                </Button>
              )}
            </footer>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default VoiceLedgerModal;
export type { VoiceLedgerModalProps };
