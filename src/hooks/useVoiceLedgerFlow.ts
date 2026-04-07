import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createTransactionUseCase } from "../application/transactions/create-transaction.usecase";
import type { ParsedTransaction } from "../domain/ai/ai.types";
import type { Transaction } from "../domain/transactions/transaction.types";
import { ApiError } from "../infrastructure/api/api-error";
import { useParseTransaction } from "./useParseTransaction";
import { useVoiceToText } from "./useVoiceToText";

export type VoiceLedgerState =
  | "idle"
  | "recording"
  | "transcribing"
  | "transcribed"
  | "parsing"
  | "preview"
  | "submitting"
  | "error";

interface UseVoiceLedgerFlowOptions {
  onTransactionCreated?: () => void;
}

interface UseVoiceLedgerFlowResult {
  state: VoiceLedgerState;
  transcript: string;
  parsedTransaction: ParsedTransaction | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  confirmTransaction: () => Promise<void>;
  cancel: () => void;
  updateTranscript: (value: string) => void;
  isLoading: boolean;
  error: string | null;
}

const TRANSACTIONS_QUERY_KEY = ["transactions"] as const;

export function useVoiceLedgerFlow(
  options?: UseVoiceLedgerFlowOptions,
): UseVoiceLedgerFlowResult {
  const queryClient = useQueryClient();

  const [state, setState] = useState<VoiceLedgerState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState("");
  const [parsedTransaction, setParsedTransaction] =
    useState<ParsedTransaction | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const stopLockRef = useRef(false);
  const confirmLockRef = useRef(false);
  const lastParsedTextRef = useRef("");

  const voiceToTextMutation = useVoiceToText();
  const parseTransactionMutation = useParseTransaction();

  const stopStreamTracks = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const resetFlow = useCallback(() => {
    setState("idle");
    setError(null);
    setTranscript("");
    setParsedTransaction(null);
    lastParsedTextRef.current = "";
    stopLockRef.current = false;
    confirmLockRef.current = false;
    audioChunksRef.current = [];
    mediaRecorderRef.current = null;
  }, []);

  const cancel = useCallback(() => {
    voiceToTextMutation.cancel();
    parseTransactionMutation.cancel();

    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }

    stopStreamTracks();

    voiceToTextMutation.reset();
    parseTransactionMutation.reset();

    resetFlow();
  }, [parseTransactionMutation, resetFlow, stopStreamTracks, voiceToTextMutation]);

  useEffect(() => {
    return () => {
      voiceToTextMutation.cancel();
      parseTransactionMutation.cancel();

      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }

      stopStreamTracks();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const parseText = useCallback(
    async (value: string): Promise<ParsedTransaction> => {
      const normalizedText = value.trim();
      if (!normalizedText) {
        throw new ApiError("Transcribed text is empty.", 400, "INVALID_RESPONSE");
      }

      setState("parsing");
      const parsed = await parseTransactionMutation.mutateAsync(normalizedText);

      setParsedTransaction(parsed);
      lastParsedTextRef.current = normalizedText;
      setState("preview");

      return parsed;
    },
    [parseTransactionMutation],
  );

  const startRecording = useCallback(async () => {
    if (state !== "idle") return;

    if (
      !navigator.mediaDevices ||
      typeof navigator.mediaDevices.getUserMedia !== "function" ||
      typeof MediaRecorder === "undefined"
    ) {
      setError("Voice recording is not supported in this browser.");
      setState("error");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      audioChunksRef.current = [];

      const preferred = "audio/webm;codecs=opus";
      const fallback = "audio/webm";
      const mimeType = MediaRecorder.isTypeSupported(preferred) ? preferred : fallback;

      const recorder = new MediaRecorder(stream, { mimeType });

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();

      setError(null);
      setState("recording");
    } catch {
      stopStreamTracks();
      setError("Microphone permission denied.");
      setState("error");
    }
  }, [state, stopStreamTracks]);

  const stopRecording = useCallback(async () => {
    if (state !== "recording" || stopLockRef.current) return;

    const recorder = mediaRecorderRef.current;
    if (!recorder) return;

    stopLockRef.current = true;
    setState("transcribing");

    try {
      const blob = await new Promise<Blob>((resolve, reject) => {
        recorder.onstop = () => {
          const rawMime = recorder.mimeType || "audio/webm";
          const cleanMime = rawMime.split(";")[0];

          const finalBlob = new Blob(audioChunksRef.current, {
            type: cleanMime,
          });

          resolve(finalBlob);
        };

        recorder.onerror = () => {
          reject(new ApiError("Recording failed.", 500, "INVALID_RESPONSE"));
        };

        recorder.stop();
      });

      stopStreamTracks();
      mediaRecorderRef.current = null;

      if (!blob || blob.size === 0) {
        throw new ApiError("No audio captured.", 400, "INVALID_RESPONSE");
      }

      const response = await voiceToTextMutation.mutateAsync(blob);
      setTranscript(response.text);
      setParsedTransaction(null);
      lastParsedTextRef.current = "";
      setError(null);
      setState("transcribed");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Transcription failed.";
      setError(message);
      setState("error");
    } finally {
      stopLockRef.current = false;
      audioChunksRef.current = [];
    }
  }, [state, stopStreamTracks, voiceToTextMutation]);

  const updateTranscript = useCallback((value: string) => {
    setTranscript(value);
    setParsedTransaction(null);
    lastParsedTextRef.current = "";
    setError(null);
    setState("transcribed");
  }, []);

  const confirmTransaction = useCallback(async () => {
    if ((state !== "transcribed" && state !== "preview") || confirmLockRef.current) {
      return;
    }

    confirmLockRef.current = true;
    setError(null);

    try {
      const normalizedTranscript = transcript.trim();
      if (!normalizedTranscript) {
        throw new ApiError("Please provide transaction text before confirming.", 400, "INVALID_RESPONSE");
      }

      let parsed = parsedTransaction;
      if (!parsed || normalizedTranscript !== lastParsedTextRef.current) {
        parsed = await parseText(normalizedTranscript);
      }

      setState("submitting");

      const newTransaction = await createTransactionUseCase(parsed);

      queryClient.setQueryData<Transaction[]>(TRANSACTIONS_QUERY_KEY, (old) => {
        return [newTransaction, ...(old ?? [])];
      });

      options?.onTransactionCreated?.();
      cancel();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to process transaction.";
      setError(message);
      setState("error");
    } finally {
      confirmLockRef.current = false;
    }
  }, [
    cancel,
    options,
    parseText,
    parsedTransaction,
    queryClient,
    state,
    transcript,
  ]);

  const isLoading = useMemo(
    () => state === "transcribing" || state === "parsing" || state === "submitting",
    [state],
  );

  return {
    state,
    transcript,
    parsedTransaction,
    startRecording,
    stopRecording,
    confirmTransaction,
    cancel,
    updateTranscript,
    isLoading,
    error,
  };
}
