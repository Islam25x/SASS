import { ApiError } from "../../../shared/api/api-error";
import {
  TransactionSchema,
  type Transaction,
} from "../utils/transaction.schema";
import type { TransactionResponseDto } from "../types/transaction.dto";

type TransactionsResponseEnvelope = {
  data?: unknown;
  result?: unknown;
  payload?: unknown;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toTrimmedString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function toFiniteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function isTransactionType(value: unknown): value is TransactionResponseDto["type"] {
  return value === "Income" || value === "Expense";
}

export function isTransactionDto(value: unknown): value is TransactionResponseDto {
  if (!isObject(value)) {
    return false;
  }

  return (
    typeof value.transactionId === "string" &&
    value.transactionId.trim().length > 0 &&
    typeof value.amount === "number" &&
    Number.isFinite(value.amount) &&
    isTransactionType(value.type) &&
    typeof value.occurredAt === "string" &&
    value.occurredAt.trim().length > 0 &&
    typeof value.categoryName === "string" &&
    value.categoryName.trim().length > 0 &&
    typeof value.notes === "string" &&
    (typeof value.source === "undefined" || typeof value.source === "string")
  );
}

function mapTransactionDto(dto: unknown): Transaction {
  if (!isTransactionDto(dto)) {
    throw new ApiError("Transaction item is invalid.", 500, "INVALID_RESPONSE");
  }

  const amount = toFiniteNumber(dto.amount);
  if (amount === null) {
    throw new ApiError("Transaction amount is invalid.", 500, "INVALID_RESPONSE");
  }

  const notes = toTrimmedString(dto.notes);
  if (!notes) {
    throw new ApiError("Transaction notes are invalid.", 500, "INVALID_RESPONSE");
  }

  const occurredAt = toTrimmedString(dto.occurredAt);
  if (!occurredAt) {
    throw new ApiError("Transaction date is invalid.", 500, "INVALID_RESPONSE");
  }

  const categoryName = toTrimmedString(dto.categoryName);
  if (!categoryName) {
    throw new ApiError("Transaction category is invalid.", 500, "INVALID_RESPONSE");
  }

  const source = toTrimmedString(dto.source);

  return TransactionSchema.parse({
    id: dto.transactionId,
    amount,
    category: categoryName,
    description: notes,
    date: occurredAt,
    type: dto.type,
    method: source === "voice" || source === "receipt" ? source : undefined,
  });
}

export function extractTransactionsData(response: unknown): TransactionResponseDto[] {
  if (Array.isArray(response)) {
    return response;
  }

  if (!isObject(response)) {
    throw new ApiError("Transactions response is invalid.", 500, "INVALID_RESPONSE");
  }

  const candidate = response as TransactionsResponseEnvelope;

  if (typeof candidate.data !== "undefined") {
    return extractTransactionsData(candidate.data);
  }

  if (typeof candidate.result !== "undefined") {
    return extractTransactionsData(candidate.result);
  }

  if (typeof candidate.payload !== "undefined") {
    return extractTransactionsData(candidate.payload);
  }

  throw new ApiError("Transactions response is invalid.", 500, "INVALID_RESPONSE");
}

export function mapTransactionsResponseToTransactions(response: unknown): Transaction[] {
  return extractTransactionsData(response).map(mapTransactionDto);
}
