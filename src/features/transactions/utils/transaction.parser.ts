import { z } from "zod";
import { ApiError } from "../../../infrastructure/api/api-error";
import {
  TransactionListSchema,
  TransactionSchema,
  type Transaction,
} from "./transaction.schema";
import type { TransactionResponseDto } from "../api/transaction.dto";
import { normalizeOptionalTransactionItem } from "./transaction-item";
import { parseParsedTransaction } from "./parsed-transaction.schema";
import { parseTransactionDate } from "./transaction-dates";

type ReceiptTransactionLikeItem = {
  name?: string;
  line_total?: number;
  unit_price?: number;
};

type ReceiptTransactionLikeResponse = {
  items: ReceiptTransactionLikeItem[];
  merchant?: string;
};

type TransactionsResponseEnvelope = {
  items?: unknown;
  data?: unknown;
  result?: unknown;
  payload?: unknown;
  pageNumber?: unknown;
  pageSize?: unknown;
  totalCount?: unknown;
};

export type TransactionsPage = {
  items: Transaction[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
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
    (typeof value.categoryName === "undefined" ||
      value.categoryName === null ||
      typeof value.categoryName === "string") &&
    (typeof value.notes === "undefined" ||
      value.notes === null ||
      typeof value.notes === "string") &&
    (typeof value.item === "undefined" || value.item === null || typeof value.item === "string") &&
    (typeof value.merchant === "undefined" ||
      value.merchant === null ||
      typeof value.merchant === "string") &&
    (typeof value.source === "undefined" ||
      value.source === null ||
      typeof value.source === "string")
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
    item: normalizeOptionalTransactionItem(parsed.merchant ?? parsed.description),
    amount: parsed.amount,
    category: parsed.category,
    description: parsed.description ?? "",
    merchant: normalizeOptionalTransactionItem(parsed.merchant),
    date: parsed.date,
    type:
      transactionType === "Income" || transactionType === "Expense"
        ? transactionType
        : "Expense",
    method:
      payload.method === "voice" || payload.method === "receipt"
        ? payload.method
        : undefined,
  });
}

function parseTransactionDto(dto: unknown): Transaction {
  if (!isTransactionDto(dto)) {
    throw new ApiError("Transaction payload is invalid.", 500, "INVALID_RESPONSE");
  }

  const amount = toFiniteNumber(dto.amount);
  if (amount === null) {
    throw new ApiError("Transaction amount is invalid.", 500, "INVALID_RESPONSE");
  }

  const occurredAt = toTrimmedString(dto.occurredAt);
  if (!occurredAt || !parseTransactionDate(occurredAt)) {
    throw new ApiError("Transaction date is invalid.", 500, "INVALID_RESPONSE");
  }

  const categoryName = toTrimmedString(dto.categoryName) ?? "Other";
  const notes = toTrimmedString(dto.notes) ?? "";
  const source = toTrimmedString(dto.source);
  const merchant = normalizeOptionalTransactionItem(dto.merchant);
  const item = normalizeOptionalTransactionItem(dto.item);
  const description = notes || item || "";

  return TransactionSchema.parse({
    id: dto.transactionId,
    item,
    amount,
    category: categoryName,
    description,
    merchant,
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

  if (Array.isArray(candidate.items)) {
    return candidate.items;
  }

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

export function mapTransactionsResponseToPage(response: unknown): TransactionsPage {
  if (Array.isArray(response)) {
    const items = response.map(parseTransactionDto);

    return {
      items,
      pageNumber: 1,
      pageSize: items.length || 4,
      totalCount: items.length,
    };
  }

  if (!isObject(response)) {
    throw new ApiError("Transactions response is invalid.", 500, "INVALID_RESPONSE");
  }

  const candidate = response as TransactionsResponseEnvelope;
  const items = extractTransactionsData(response).map(parseTransactionDto);
  const pageNumber = Math.max(1, toFiniteNumber(candidate.pageNumber) ?? 1);
  const pageSize = Math.max(1, toFiniteNumber(candidate.pageSize) ?? items.length ?? 4);
  const totalCount = Math.max(0, toFiniteNumber(candidate.totalCount) ?? items.length);

  return {
    items,
    pageNumber,
    pageSize,
    totalCount,
  };
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
    item: normalizeOptionalTransactionItem(data.merchant ?? data.description),
    amount: data.amount,
    category: data.category,
    description: data.description ?? "",
    merchant: normalizeOptionalTransactionItem(data.merchant),
    date: data.date,
    type: data.transaction_type === "income" ? "Income" : "Expense",
  });
}

export function buildTransactionsFromReceipt(
  response: ReceiptTransactionLikeResponse,
  input: { issuedAt: string; ids: string[] },
): Transaction[] {
  return response.items.map((item, index) =>
    TransactionSchema.parse({
      id: input.ids[index] ?? "",
      item: normalizeOptionalTransactionItem(item.name),
      description: normalizeOptionalTransactionItem(item.name) ?? "",
      amount: item.line_total ?? item.unit_price ?? 0,
      category: "Receipt",
      merchant: normalizeOptionalTransactionItem(response.merchant),
      date: input.issuedAt,
      type: "Expense",
      method: "receipt",
    }),
  );
}
