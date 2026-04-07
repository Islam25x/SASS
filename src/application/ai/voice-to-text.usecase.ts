import {
  parseVoiceToTextResponse,
} from "../../domain/ai/ai.rules";
import type { VoiceToTextResponse } from "../../domain/ai/ai.types";
import { ApiError } from "../../infrastructure/api/api-error";
import { voiceToTextApi } from "../../infrastructure/api/ai.api";

export async function voiceToTextUseCase(
  blob: Blob,
  options?: { signal?: AbortSignal },
): Promise<VoiceToTextResponse> {
  try {
    const payload = await voiceToTextApi(blob, options);
    return parseVoiceToTextResponse(payload);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError("Invalid voice-to-text response.", 500, "INVALID_RESPONSE", undefined, error);
  }
}
