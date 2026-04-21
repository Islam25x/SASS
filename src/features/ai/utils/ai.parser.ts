import { z } from "zod";
import {
  ParsedTransactionSchema,
  ReceiptOcrItemSchema,
  ReceiptOcrResponseSchema,
  VoiceToTextResponseSchema,
  type ParsedTransaction,
  type ReceiptOcrItem,
  type ReceiptOcrResponse,
  type VoiceToTextResponse,
} from "../types/ai.types";

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

export function parseVoiceToTextResponse(payload: unknown): VoiceToTextResponse {
  return VoiceToTextResponseSchema.parse(payload);
}

export function parseParsedTransaction(payload: unknown): ParsedTransaction {
  if (!isObject(payload)) {
    throw new z.ZodError([
      {
        code: "custom",
        path: [],
        message: "Expected object",
      },
    ]);
  }

  const amount = toFiniteNumber(payload.amount);
  const category = asString(payload.category);

  const normalized = {
    amount,
    currency: asString(payload.currency) ?? undefined,
    merchant: asString(payload.merchant) ?? undefined,
    category: category ?? "",
    transaction_type:
      asString(payload.transaction_type) ??
      asString(payload.transactionType) ??
      undefined,
    date: asString(payload.date) ?? undefined,
    description:
      asString(payload.merchant) ??
      asString(payload.description) ??
      "Voice transaction",
  };

  return ParsedTransactionSchema.parse(normalized);
}

function parseReceiptItem(payload: unknown): ReceiptOcrItem {
  if (!isObject(payload)) {
    throw new z.ZodError([
      {
        code: "custom",
        path: [],
        message: "Expected object",
      },
    ]);
  }

  const normalized = {
    name:
      asString(payload.name) ??
      asString(payload.merchant) ??
      asString(payload.description) ??
      undefined,
    line_total: toFiniteNumber(payload.line_total) ?? toFiniteNumber(payload.amount) ?? undefined,
    unit_price: toFiniteNumber(payload.unit_price) ?? undefined,
    quantity: toFiniteNumber(payload.quantity) ?? undefined,
  };

  return ReceiptOcrItemSchema.parse(normalized);
}

export function parseReceiptOcrResponse(payload: unknown): ReceiptOcrResponse {
  if (Array.isArray(payload)) {
    const items = payload.map((entry) => {
      const parsed = parseParsedTransaction(entry);
      return {
        name: parsed.merchant ?? parsed.description,
        line_total: parsed.amount,
        quantity: 1,
      };
    });

    return ReceiptOcrResponseSchema.parse({ items });
  }

  if (!isObject(payload)) {
    throw new z.ZodError([
      {
        code: "custom",
        path: [],
        message: "Expected object",
      },
    ]);
  }

  if (Array.isArray(payload.items)) {
    return ReceiptOcrResponseSchema.parse({
      items: payload.items.map(parseReceiptItem),
      merchant: asString(payload.merchant) ?? undefined,
      issued_at: asString(payload.issued_at) ?? asString(payload.date) ?? undefined,
    });
  }

  if (Array.isArray(payload.transactions)) {
    const items = payload.transactions.map((entry) => {
      const parsed = parseParsedTransaction(entry);
      return {
        name: parsed.merchant ?? parsed.description,
        line_total: parsed.amount,
        quantity: 1,
      };
    });

    return ReceiptOcrResponseSchema.parse({
      items,
      merchant: asString(payload.merchant) ?? undefined,
      issued_at: asString(payload.issued_at) ?? asString(payload.date) ?? undefined,
    });
  }

  return ReceiptOcrResponseSchema.parse(payload);
}
