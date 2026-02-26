import { useEffect, useRef } from "react";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { type VoiceToTextResponse, voiceToText } from "../services/ai.api";

type VoiceToTextMutation = UseMutationResult<
  VoiceToTextResponse,
  Error,
  Blob
>;

type UseVoiceToTextResult = VoiceToTextMutation & {
  cancel: () => void;
};

export function useVoiceToText(): UseVoiceToTextResult {
  const abortControllerRef = useRef<AbortController | null>(null);

  const mutation = useMutation<VoiceToTextResponse, Error, Blob>({
    mutationKey: ["ai", "voice-to-text"],
    mutationFn: async (blob) => {
      if (!(blob instanceof Blob) || blob.size === 0) {
        throw new Error("No audio captured.");
      }

      abortControllerRef.current?.abort();

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        return await voiceToText(blob, {
          signal: controller.signal,
        });
      } finally {
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
      }
    },
    retry: 0,
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
