import { requestJson } from "../../../infrastructure/api/http";
import type {
  ChatDto,
  SendChatMessageDto,
  SendChatMessageResponseDto,
} from "./ai.dto";

export async function getChatMessagesApi(
    options?: { signal?: AbortSignal },
): Promise<ChatDto> {
    return requestJson<ChatDto>("/api/Chat", {
        method: "GET",
        signal: options?.signal,
        withAuth: true,
    });
}

export async function sendChatMessageApi(
    payload: SendChatMessageDto,
    options?: { signal?: AbortSignal },
): Promise<SendChatMessageResponseDto> {
    return requestJson<SendChatMessageResponseDto>("/api/Chat/send", {
        method: "POST",
        body: JSON.stringify(payload),
        signal: options?.signal,
        withAuth: true,
    });
}
