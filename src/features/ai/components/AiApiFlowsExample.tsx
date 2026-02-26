import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { useParseTransaction } from "../../../hooks/useParseTransaction";
import { useReceiptOcr } from "../../../hooks/useReceiptOcr";
import { useVoiceToText } from "../../../hooks/useVoiceToText";
import type { ParsedTransaction } from "../../../services/ai.api";

// Example UI layer: consumes hooks only, keeps API details outside the component.
interface AiApiFlowsExampleProps {
  onConfirmParsedTransaction?: (transaction: ParsedTransaction) => Promise<void>;
  onConfirmReceiptTransactions?: (transactions: ParsedTransaction[]) => Promise<void>;
}

interface InlineToastProps {
  message: string;
  onClose: () => void;
}

function InlineToast({ message, onClose }: InlineToastProps) {
  return (
    <div className="fixed right-6 top-6 z-[70] rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-lg">
      <div className="flex items-center gap-3">
        <span>{message}</span>
        <button
          type="button"
          onClick={onClose}
          className="rounded px-2 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

function SpinnerLabel({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Loader2 size={16} className="animate-spin" />
      {label}
    </span>
  );
}

const NOOP_CONFIRM = async () => {};

function AiApiFlowsExample({
  onConfirmParsedTransaction = NOOP_CONFIRM,
  onConfirmReceiptTransactions = NOOP_CONFIRM,
}: AiApiFlowsExampleProps) {
  const [voiceFile, setVoiceFile] = useState<File | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [transcriptText, setTranscriptText] = useState("");
  const [parsedPreview, setParsedPreview] = useState<ParsedTransaction | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [confirmingVoice, setConfirmingVoice] = useState(false);
  const [confirmingReceipt, setConfirmingReceipt] = useState(false);

  const voiceToTextMutation = useVoiceToText();
  const parseTransactionMutation = useParseTransaction({
    invalidateTransactions: true,
    transactionsQueryKey: ["transactions"],
  });
  const receiptOcrMutation = useReceiptOcr();

  const isVoiceFlowPending =
    voiceToTextMutation.isPending || parseTransactionMutation.isPending || confirmingVoice;
  const isReceiptFlowPending = receiptOcrMutation.isPending || confirmingReceipt;

  const receiptTransactions = useMemo(
    () =>
      (receiptOcrMutation.data?.items ?? []).map((item) => ({
        amount: item.line_total ?? item.unit_price ?? 0,
        category: "Receipt",
        description:
          item.name ?? receiptOcrMutation.data?.merchant ?? "Receipt item",
        date: receiptOcrMutation.data?.issued_at,
      })),
    [receiptOcrMutation.data],
  );

  useEffect(() => {
    if (voiceToTextMutation.error) {
      setToastMessage(voiceToTextMutation.error.message);
    }
  }, [voiceToTextMutation.error]);

  useEffect(() => {
    if (parseTransactionMutation.error) {
      setToastMessage(parseTransactionMutation.error.message);
    }
  }, [parseTransactionMutation.error]);

  useEffect(() => {
    if (receiptOcrMutation.error) {
      setToastMessage(receiptOcrMutation.error.message);
    }
  }, [receiptOcrMutation.error]);

  const handleVoiceFlow = async () => {
    if (!voiceFile || isVoiceFlowPending) {
      return;
    }

    const transcript = await voiceToTextMutation.mutateAsync(voiceFile);
    setTranscriptText(transcript.text);

    const parsed = await parseTransactionMutation.mutateAsync(transcript.text);
    setParsedPreview(parsed);
    setVoiceFile(null);
  };

  const handleReceiptFlow = async () => {
    if (!receiptFile || isReceiptFlowPending) {
      return;
    }

    await receiptOcrMutation.mutateAsync(receiptFile);
    setReceiptFile(null);
  };

  const handleConfirmParsed = async () => {
    if (!parsedPreview || confirmingVoice) {
      return;
    }

    setConfirmingVoice(true);
    try {
      await onConfirmParsedTransaction(parsedPreview);
      setParsedPreview(null);
      setTranscriptText("");
      voiceToTextMutation.reset();
      parseTransactionMutation.reset();
    } catch {
      setToastMessage("Unable to save transaction right now.");
    } finally {
      setConfirmingVoice(false);
    }
  };

  const handleConfirmReceipt = async () => {
    if (receiptTransactions.length === 0 || confirmingReceipt) {
      return;
    }

    setConfirmingReceipt(true);
    try {
      await onConfirmReceiptTransactions(receiptTransactions);
      receiptOcrMutation.reset();
    } catch {
      setToastMessage("Unable to save receipt transactions right now.");
    } finally {
      setConfirmingReceipt(false);
    }
  };

  return (
    <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {toastMessage && (
        <InlineToast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      <div className="space-y-4">
        <h3 className="text-base font-semibold text-slate-900">Voice Flow</h3>
        <input
          type="file"
          accept="audio/*"
          onChange={(event) => setVoiceFile(event.target.files?.[0] ?? null)}
          className="block w-full rounded-lg border border-slate-200 p-2 text-sm text-slate-700"
        />
        <button
          type="button"
          disabled={!voiceFile || isVoiceFlowPending}
          onClick={handleVoiceFlow}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isVoiceFlowPending ? (
            <SpinnerLabel label="Processing..." />
          ) : (
            "Transcribe and Parse"
          )}
        </button>

        {transcriptText && (
          <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
            <p className="font-medium text-slate-900">Transcript</p>
            <p className="mt-1">{transcriptText}</p>
          </div>
        )}

        {parsedPreview && (
          <div className="rounded-lg border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-900">Parsed Preview</p>
            <div className="mt-2 space-y-1 text-sm text-slate-700">
              <p>Amount: {parsedPreview.amount}</p>
              <p>Category: {parsedPreview.category}</p>
              <p>Description: {parsedPreview.description}</p>
              <p>Date: {parsedPreview.date ?? "N/A"}</p>
            </div>
            <button
              type="button"
              disabled={confirmingVoice}
              onClick={handleConfirmParsed}
              className="mt-3 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {confirmingVoice ? <SpinnerLabel label="Saving..." /> : "Confirm Transaction"}
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-base font-semibold text-slate-900">Receipt Flow</h3>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setReceiptFile(event.target.files?.[0] ?? null)}
          className="block w-full rounded-lg border border-slate-200 p-2 text-sm text-slate-700"
        />
        <button
          type="button"
          disabled={!receiptFile || isReceiptFlowPending}
          onClick={handleReceiptFlow}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isReceiptFlowPending ? <SpinnerLabel label="Extracting..." /> : "Run OCR"}
        </button>

        {receiptTransactions.length > 0 && (
          <div className="rounded-lg border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-900">Extracted Transactions</p>
            <ul className="mt-2 space-y-2 text-sm text-slate-700">
              {receiptTransactions.map((transaction, index) => (
                <li key={`${transaction.description}-${index}`} className="rounded bg-slate-50 p-2">
                  {transaction.description} - {transaction.amount} ({transaction.category})
                </li>
              ))}
            </ul>
            <button
              type="button"
              disabled={confirmingReceipt}
              onClick={handleConfirmReceipt}
              className="mt-3 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {confirmingReceipt ? <SpinnerLabel label="Saving..." /> : "Confirm Bulk Add"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default AiApiFlowsExample;
