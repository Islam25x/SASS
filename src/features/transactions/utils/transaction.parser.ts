import { z } from "zod";
import { parseParsedTransaction } from "../../ai/utils/ai.parser";
import { ApiError } from "../../../shared/api/api-error";
import {
  TransactionListSchema,
  TransactionSchema,
  type Transaction,
} from "./transaction.schema";
import type { ReceiptOcrResponse } from "../../ai/types/ai.types";
import type { TransactionResponseDto } from "../types/transaction.dto";

type TransactionsResponseEnvelope = {
  data?: unknown;
  result?: unknown;
  payload?: unknown;
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const asString = (value: unknown): string | null =>
  typeof value === "string" && value.trim().length > 0 ? value : null;

const asStringOrNumber = (value: unknown): string | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  return asString(value);
};

const toTrimmedString = (value: unknown): string | null =>
  typeof value === "string" && value.trim() ? value.trim() : null;

const toFiniteNumber = (value: unknown): number | null =>
  typeof value === "number" && Number.isFinite(value) ? value : null;

function isTransactionType(value: unknown): value is TransactionResponseDto["type"] {
  return value === "Income" || value === "Expense";
}

function isTransactionDto(value: unknown): value is TransactionResponseDto {
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

export function parseTransaction(payload: unknown): Transaction {
  if (!isObject(payload)) {
    throw new z.ZodError([
      {
        code: "custom",
        path: [],
        message: "Expected object",
      },
    ]);
  }

  const id = asStringOrNumber(payload.id) ?? asStringOrNumber(payload._id);
  const parsed = parseParsedTransaction(payload);
  const transactionType =
    asString(payload.transaction_type) ??
    asString(payload.transactionType) ??
    asString(payload.type) ??
    undefined;

  return TransactionSchema.parse({
    id: id ?? "",
    amount: parsed.amount,
    category: parsed.category,
    description: parsed.description,
    date: parsed.date,
    transaction_type: transactionType,
    type: asString(payload.type) ?? undefined,
    method:
      payload.method === "voice" || payload.method === "receipt"
        ? payload.method
        : undefined,
  });
}

function parseTransactionDto(dto: unknown): Transaction {
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

function extractTransactionsData(response: unknown): TransactionResponseDto[] {
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
  return extractTransactionsData(response).map(parseTransactionDto);
}

export function parseTransactionList(payload: unknown): Transaction[] {
  if (Array.isArray(payload)) {
    return TransactionListSchema.parse(payload.map(parseTransaction));
  }

  if (isObject(payload) && Array.isArray(payload.transactions)) {
    return TransactionListSchema.parse(payload.transactions.map(parseTransaction));
  }

  throw new z.ZodError([
    {
      code: "custom",
      path: ["transactions"],
      message: "Invalid transactions response",
    },
  ]);
}

export function buildTransactionFromParsed(
  parsed: unknown,
  input: { id: string },
): Transaction {
  const data = parseParsedTransaction(parsed);
  return TransactionSchema.parse({
    id: input.id,
    amount: data.amount,
    category: data.category,
    description: data.merchant ?? "Voice transaction",
    date: data.date,
    transaction_type: data.transaction_type ?? "expense",
  });
}

export function buildTransactionsFromReceipt(
  response: ReceiptOcrResponse,
  input: { issuedAt: string; ids: string[] },
): Transaction[] {
  return response.items.map((item, index) =>
    TransactionSchema.parse({
      id: input.ids[index] ?? "",
      description: item.name ?? response.merchant ?? "Receipt item",
      amount: item.line_total ?? item.unit_price ?? 0,
      category: "Receipt",
      date: input.issuedAt,
      type: "expense",
      transaction_type: "expense",
      method: "receipt",
    }),
  );
}
