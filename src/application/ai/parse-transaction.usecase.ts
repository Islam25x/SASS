import { z } from "zod";
import { parseParsedTransaction } from "../../domain/ai/ai.rules";
import type { ParsedTransaction } from "../../domain/ai/ai.types";
import { ApiError } from "../../infrastructure/api/api-error";
import { parseTransactionApi } from "../../infrastructure/api/ai.api";

const ParseTransactionInputSchema = z.string().min(1);

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export async function parseTransactionUseCase(
  text: string,
  options?: { signal?: AbortSignal },
): Promise<ParsedTransaction> {
  try {
    ParseTransactionInputSchema.parse(text);

    const payload = await parseTransactionApi(text, options);

    if (isObject(payload) && isObject(payload.transaction)) {
      return parseParsedTransaction(payload.transaction);
    }

    return parseParsedTransaction(payload);
  } catch (error) {
    throw new ApiError(
      "Invalid transaction payload received.",
      500,
      "INVALID_RESPONSE",
      undefined,
      error,
    );
  }
}
