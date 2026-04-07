import { z } from "zod";
import { parseParsedTransaction } from "../ai/ai.rules";
import {
  TransactionListSchema,
  TransactionSchema,
  type Transaction,
} from "./transaction.schema";
import type { ReceiptOcrResponse } from "../ai/ai.schema";

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
