import { ApiError, mapApiError, readErrorMessage } from "./api-error";

const AI_API_BASE_URL = "https://stt-flax.vercel.app/api";

export async function requestJson<T>(path: string, init: RequestInit): Promise<T> {
  try {
    const headers = new Headers(init.headers ?? {});
    const isFormData = init.body instanceof FormData;
    const hasBody = typeof init.body !== "undefined";

    if (isFormData) {
      headers.delete("Content-Type");
    } else if (hasBody && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    const response = await fetch(`${AI_API_BASE_URL}${path}`, {
      ...init,
      headers,
    });

    if (!response.ok) {
      const message = await readErrorMessage(response);
      throw new ApiError(message, response.status, "HTTP");
    }

    return (await response.json()) as T;
  } catch (error) {
    throw mapApiError(error);
  }
}

export function getAiApiBaseUrl(): string {
  return AI_API_BASE_URL;
}
