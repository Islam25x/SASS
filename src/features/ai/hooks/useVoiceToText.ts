import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { ApiError } from "../../../infrastructure/api/api-error";
import { voiceToTextApi } from "../api/ai.api";
import type { VoiceToTextResponse } from "../api/ai.dto";
import { parseVoiceToTextResponse } from "../utils/ai.parser";

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
