import { ApiError, mapApiError, readErrorMessage } from "../../shared/api/api-error";
import { getAiApiBaseUrl, requestJson } from "../../shared/api/http";

export async function voiceToTextApi(
  blob: Blob,
  options?: { signal?: AbortSignal },
): Promise<unknown> {
  try {
    if (!(blob instanceof Blob) || blob.size === 0) {
      throw new ApiError("Audio blob is empty.", 400, "INVALID_RESPONSE");
    }

    const formData = new FormData();
    formData.append("file", blob, "voice.webm");

    const response = await fetch(`${getAiApiBaseUrl()}/voice-to-text`, {
      method: "POST",
      body: formData,
      signal: options?.signal,
    });

    if (!response.ok) {
      const message = await readErrorMessage(response);
      throw new ApiError(message, response.status, "HTTP");
    }

    return response.json();
  } catch (error) {
    throw mapApiError(error);
  }
}

export async function parseTransactionApi(
  text: string,
  options?: { signal?: AbortSignal },
): Promise<unknown> {
  return requestJson<unknown>("/parse-transaction", {
    method: "POST",
    body: JSON.stringify({ text }),
    signal: options?.signal,
  });
}

export async function receiptOcrApi(
  file: File,
  options?: { signal?: AbortSignal },
): Promise<unknown> {
  const formData = new FormData();
  formData.append("file", file);

  return requestJson<unknown>("/receipt-ocr", {
    method: "POST",
    body: formData,
    signal: options?.signal,
  });
}

export async function sendChatbotMessageApi(
  message: string,
  options?: { signal?: AbortSignal },
): Promise<Response> {
  try {
    const response = await fetch(`${getAiApiBaseUrl()}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
      signal: options?.signal,
    });

    if (!response.ok) {
      const messageText = await readErrorMessage(response);
      throw new ApiError(messageText, response.status, "HTTP");
    }

    return response;
  } catch (error) {
    throw mapApiError(error);
  }
}
