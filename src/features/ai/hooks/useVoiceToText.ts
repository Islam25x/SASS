import { useEffect, useRef } from "react";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { voiceToTextApi } from "../api/ai.api";
import type { VoiceToTextResponse } from "../types/ai.types";
import { parseVoiceToTextResponse } from "../utils/ai.parser";
import { ApiError } from "../../../shared/api/api-error";

type VoiceToTextMutation = UseMutationResult<
  VoiceToTextResponse,
  ApiError,
  Blob
>;

type UseVoiceToTextResult = VoiceToTextMutation & {
  cancel: () => void;
};

export function useVoiceToText(): UseVoiceToTextResult {
  const abortControllerRef = useRef<AbortController | null>(null);

  const mutation = useMutation<VoiceToTextResponse, ApiError, Blob>({
    mutationKey: ["ai", "voice-to-text"],
    mutationFn: async (blob) => {
      if (!(blob instanceof Blob) || blob.size === 0) {
        throw new ApiError("No audio captured.", 400, "INVALID_RESPONSE");
      }

      abortControllerRef.current?.abort();

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const payload = await voiceToTextApi(blob, {
          signal: controller.signal,
        });
        return parseVoiceToTextResponse(payload);
      } catch (error) {
        if (error instanceof ApiError) {
          throw error;
        }

        throw new ApiError("Invalid voice-to-text response.", 500, "INVALID_RESPONSE", undefined, error);
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
