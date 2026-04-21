import { ApiError } from "../../../shared/api/api-error";
import { getCategoriesApi } from "../api/get-categories.api";
import { isObjectRecord, mapCategoryDto } from "./category.mapping";
import type { TransactionCategory } from "../types/category.types";

type CategoryEnvelope = {
  data?: unknown;
  result?: unknown;
  payload?: unknown;
  categories?: unknown;
};

function extractCategoriesEnvelope(response: unknown): unknown {
  if (Array.isArray(response)) {
    return response;
  }

  if (!isObjectRecord(response)) {
    throw new ApiError("Categories response is invalid.", 500, "INVALID_RESPONSE");
  }

  const envelope = response as CategoryEnvelope;

  if (Array.isArray(envelope.data)) {
    return envelope.data;
  }

  if (Array.isArray(envelope.result)) {
    return envelope.result;
  }

  if (Array.isArray(envelope.payload)) {
    return envelope.payload;
  }

  if (Array.isArray(envelope.categories)) {
    return envelope.categories;
  }

  throw new ApiError("Categories response is invalid.", 500, "INVALID_RESPONSE");
}

export async function getCategoriesUseCase(
  options?: { signal?: AbortSignal; accessToken?: string },
): Promise<TransactionCategory[]> {
  const response = await getCategoriesApi(options);
  const categories = extractCategoriesEnvelope(response);

  if (!Array.isArray(categories)) {
    throw new ApiError("Categories response is invalid.", 500, "INVALID_RESPONSE");
  }

  return categories.map(mapCategoryDto);
}
