import { sendChatbotMessageApi } from "../../infrastructure/api/ai.api";

export async function sendChatMessageUseCase(
  message: string,
  options?: { signal?: AbortSignal },
): Promise<Response> {
  return sendChatbotMessageApi(message, options);
}
