const AI_API_BASE_URL = "https://stt-flax.vercel.app/api";

export interface VoiceToTextResponse {
  text: string;
}

export interface ParsedTransaction {
  amount: number;
  currency?: string;
  merchant?: string;
  category: string;
  transaction_type?: string;
  date?: string;
  description: string;
}

export interface ReceiptOcrResponse {
  transactions: ParsedTransaction[];
}

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date?: string;
  transaction_type?: string;
}

interface ApiErrorPayload {
  message?: string;
  error?: string;
  detail?: string;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: "ABORTED" | "NETWORK" | "HTTP" | "INVALID_RESPONSE";

  constructor(
    message: string,
    status: number,
    code: ApiError["code"] = "HTTP",
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again.";

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const asString = (value: unknown): string | null =>
  typeof value === "string" && value.trim().length > 0 ? value : null;

const toFiniteNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().replace(/,/g, "");
    if (!normalized) {
      return null;
    }

    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const asStringOrNumber = (value: unknown): string | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  return asString(value);
};

function mapError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof DOMException && error.name === "AbortError") {
    return new ApiError("Request was cancelled.", 499, "ABORTED");
  }

  if (error instanceof TypeError) {
    return new ApiError("Network error. Please check your connection.", 0, "NETWORK");
  }

  return new ApiError(DEFAULT_ERROR_MESSAGE, 500, "HTTP");
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as ApiErrorPayload;
    return (
      payload.message ??
      payload.error ??
      payload.detail ??
      `Request failed with status ${response.status}.`
    );
  } catch {
    return `Request failed with status ${response.status}.`;
  }
}

async function requestJson<T>(path: string, init: RequestInit): Promise<T> {
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
    throw mapError(error);
  }
}

function toParsedTransaction(value: unknown): ParsedTransaction {
  if (!isObject(value)) {
    throw new ApiError("Invalid transaction payload received.", 500, "INVALID_RESPONSE");
  }

  const amount = toFiniteNumber(value.amount);
  const category = asString(value.category);
  if (amount === null || category === null) {
    throw new ApiError("Invalid transaction payload received.", 500, "INVALID_RESPONSE");
  }

  const currency = asString(value.currency) ?? undefined;
  const merchant = asString(value.merchant) ?? undefined;
  const transactionType =
    asString(value.transaction_type) ??
    asString(value.transactionType) ??
    undefined;
  const date = asString(value.date) ?? undefined;
  const description =
    merchant ??
    asString(value.description) ??
    "Voice transaction";

  return {
    amount,
    currency,
    merchant,
    category,
    transaction_type: transactionType,
    date,
    description,
  };
}

function toTransaction(value: unknown): Transaction {
  if (!isObject(value)) {
    throw new ApiError("Invalid transaction payload received.", 500, "INVALID_RESPONSE");
  }

  const id = asStringOrNumber(value.id) ?? asStringOrNumber(value._id);
  const parsed = toParsedTransaction(value);
  const transactionType =
    asString(value.transaction_type) ??
    asString(value.transactionType) ??
    asString(value.type) ??
    undefined;

  if (!id) {
    throw new ApiError("Transaction id is missing in response.", 500, "INVALID_RESPONSE");
  }

  return {
    id,
    ...parsed,
    transaction_type: transactionType,
  };
}

export async function voiceToText(
  blob: Blob,
  options?: { signal?: AbortSignal },
): Promise<VoiceToTextResponse> {

  if (!(blob instanceof Blob) || blob.size === 0) {
    throw new Error("Audio blob is empty.");
  }

  const formData = new FormData();
  formData.append("file", blob, "voice.webm");

  const response = await fetch(
    `${AI_API_BASE_URL}/voice-to-text`,
    {
      method: "POST",
      body: formData,
      signal: options?.signal,    },
  );

  if (!response.ok) {
    const message = await readErrorMessage(response);
    throw new Error(message);
  }

  return response.json();
}

export async function parseTransaction(
  text: string,
  options?: { signal?: AbortSignal },
): Promise<ParsedTransaction> {
  const payload = await requestJson<Record<string, unknown>>("/parse-transaction", {
    method: "POST",
    body: JSON.stringify({ text }),
    signal: options?.signal,
  });

  if (isObject(payload.transaction)) {
    return toParsedTransaction(payload.transaction);
  }

  return toParsedTransaction(payload);
}

export async function receiptOcr(
  file: File,
  options?: { signal?: AbortSignal },
): Promise<ReceiptOcrResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const payload = await requestJson<Record<string, unknown> | unknown[]>(
    "/receipt-ocr",
    {
      method: "POST",
      body: formData,
      signal: options?.signal,
    },
  );

  if (Array.isArray(payload)) {
    return {
      transactions: payload.map(toParsedTransaction),
    };
  }

  if (isObject(payload) && Array.isArray(payload.transactions)) {
    return {
      transactions: payload.transactions.map(toParsedTransaction),
    };
  }

  throw new ApiError("Invalid receipt OCR response.", 500, "INVALID_RESPONSE");
}

export async function fetchTransactions(
  options?: { signal?: AbortSignal },
): Promise<Transaction[]> {
  const payload = await requestJson<Record<string, unknown> | unknown[]>("/transactions", {
    method: "GET",
    signal: options?.signal,
  });

  if (Array.isArray(payload)) {
    return payload.map(toTransaction);
  }

  if (isObject(payload) && Array.isArray(payload.transactions)) {
    return payload.transactions.map(toTransaction);
  }

  throw new ApiError("Invalid transactions response.", 500, "INVALID_RESPONSE");
}

export async function sendChatbotMessage(
  message: string,
  options?: { signal?: AbortSignal },
): Promise<Response> {
  try {
    const response = await fetch(`${AI_API_BASE_URL}/chat`, {
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
    throw mapError(error);
  }
}
