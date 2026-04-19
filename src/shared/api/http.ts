import { readStoredAuthToken } from "../../infrastructure/auth/auth-storage";
import { ApiError, mapApiError, readErrorMessage } from "./api-error";

const AI_API_BASE_URL = "https://stt-flax.vercel.app/api";
export const API_UNAUTHORIZED_EVENT = "app:api-unauthorized";

interface RequestJsonOptions extends RequestInit {
  baseUrl?: string;
  withAuth?: boolean;
  accessToken?: string;
}

function dispatchUnauthorizedEvent(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(API_UNAUTHORIZED_EVENT));
}

export async function requestJson<T>(
  path: string,
  init: RequestJsonOptions,
): Promise<T> {
  try {
    const headers = new Headers(init.headers ?? {});
    const isFormData = init.body instanceof FormData;
    const hasBody = typeof init.body !== "undefined";
    const baseUrl = init.baseUrl ?? AI_API_BASE_URL;
    const token = init.withAuth ? init.accessToken ?? readStoredAuthToken() : null;

    if (isFormData) {
      headers.delete("Content-Type");
    } else if (hasBody && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers,
    });

    if (!response.ok) {
      const message = await readErrorMessage(response);
      if (response.status === 401) {
        dispatchUnauthorizedEvent();
      }
      throw new ApiError(message, response.status, "HTTP");
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const contentType = response.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      return (await response.json()) as T;
    }

    const text = await response.text();
    return text as T;
  } catch (error) {
    throw mapApiError(error);
  }
}

export function getAiApiBaseUrl(): string {
  return AI_API_BASE_URL;
}
