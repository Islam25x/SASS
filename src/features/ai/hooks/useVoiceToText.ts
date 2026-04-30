import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { ApiError } from "../../../infrastructure/api/api-error";
import { voiceToTextApi } from "../api/ai.api";
import { parseVoiceToTextResponse } from "../utils/ai.parser";
import type { VoiceToTextResponse } from "../types/ai.types";

export function useVoiceToText(): UseMutationResult<
  VoiceToTextResponse,
  ApiError,
  File
> {
  return useMutation<VoiceToTextResponse, ApiError, File>({
    mutationFn: async (file) => parseVoiceToTextResponse(await voiceToTextApi(file)),
    retry: 0,
  });
}
