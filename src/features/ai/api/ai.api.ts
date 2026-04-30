import { getAppApiBaseUrl } from "../../../infrastructure/api/api-config";
import { requestJson } from "../../../infrastructure/api/http";

export async function voiceToTextApi(
  file: File,
  options?: { signal?: AbortSignal },
): Promise<unknown> {
  const formData = new FormData();
  formData.append("file", file);

  return requestJson<unknown>("/api/AI/voice-to-text", {
    method: "POST",
    body: formData,
    signal: options?.signal,
    baseUrl: getAppApiBaseUrl(),
    withAuth: true,
  });
}

export async function parseTransactionApi(
  message: string,
  options?: { signal?: AbortSignal },
): Promise<unknown> {
  return requestJson<unknown>("/api/AI/parse-transaction", {
    method: "POST",
    body: JSON.stringify({ text: message }),
    signal: options?.signal,
    baseUrl: getAppApiBaseUrl(),
    withAuth: true,
  });
}

export async function receiptOcrApi(
  file: File,
  options?: { signal?: AbortSignal },
): Promise<unknown> {
  const formData = new FormData();
  formData.append("file", file);

  return requestJson<unknown>("/api/AI/receipt-ocr", {
    method: "POST",
    body: formData,
    signal: options?.signal,
    baseUrl: getAppApiBaseUrl(),
    withAuth: true,
  });
}
