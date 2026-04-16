export interface ApiErrorPayload {
  message?: string;
  error?: string;
  detail?: string;
  title?: string;
  errors?: Record<string, string[]>;
}

export class ApiError extends Error {
  readonly status?: number;
  readonly code: "ABORTED" | "NETWORK" | "HTTP" | "INVALID_RESPONSE";
  readonly details?: unknown;

  constructor(
    message: string,
    status?: number,
    code: ApiError["code"] = "HTTP",
    details?: unknown,
    cause?: unknown,
  ) {
    super(message, { cause });
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again.";

export function mapApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof DOMException && error.name === "AbortError") {
    return new ApiError("Request was cancelled.", 499, "ABORTED", undefined, error);
  }

  if (error instanceof TypeError) {
    return new ApiError(
      "Network error. Please check your connection.",
      0,
      "NETWORK",
      undefined,
      error,
    );
  }

  return new ApiError(DEFAULT_ERROR_MESSAGE, 500, "HTTP", undefined, error);
}

export async function readErrorMessage(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as ApiErrorPayload;
    const validationMessages = payload.errors
      ? Object.values(payload.errors)
          .flat()
          .filter(Boolean)
      : [];

    return (
      payload.message ??
      payload.error ??
      payload.detail ??
      payload.title ??
      validationMessages[0] ??
      `Request failed with status ${response.status}.`
    );
  } catch {
    return `Request failed with status ${response.status}.`;
  }
}
