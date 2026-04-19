import { ApiError } from "../../../shared/api/api-error";
import { createCategoryApi } from "../api/create-category.api";
import { isObjectRecord, mapCategoryDto } from "./category.mapping";
import type {
  CreateTransactionCategoryInput,
  TransactionCategory,
} from "../domain/category.types";

type CategoryEnvelope = {
  data?: unknown;
  result?: unknown;
  payload?: unknown;
  category?: unknown;
};

function extractCategoryEnvelope(response: unknown): unknown {
  if (!isObjectRecord(response)) {
    return null;
  }

  const envelope = response as CategoryEnvelope;

  return envelope.data ?? envelope.result ?? envelope.payload ?? envelope.category ?? response;
}

export async function createCategoryUseCase(
  input: CreateTransactionCategoryInput,
  options?: { signal?: AbortSignal },
): Promise<TransactionCategory | null> {
  const name = input.name.trim();

  if (!name) {
    throw new ApiError("Category name is required.", 400, "INVALID_RESPONSE");
  }

  const response = await createCategoryApi(
    {
      name,
      type: input.type,
    },
    options,
  );

  if (typeof response === "undefined" || response === null || response === "") {
    return null;
  }

  return mapCategoryDto(extractCategoryEnvelope(response));
}
