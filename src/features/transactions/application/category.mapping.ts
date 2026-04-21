import { ApiError } from "../../../shared/api/api-error";
import type { TransactionCategory } from "../types/category.types";

type CategoryDto = {
  id?: unknown;
  name?: unknown;
  categoryType?: unknown;
  type?: unknown;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function mapCategoryType(value: unknown): TransactionCategory["categoryType"] {
  const normalized = readTrimmedString(value).toLowerCase();

  if (normalized === "expense") {
    return "Expense";
  }

  if (normalized === "income") {
    return "Income";
  }

  throw new ApiError("Category type is invalid.", 500, "INVALID_RESPONSE");
}

export function mapCategoryDto(dto: unknown): TransactionCategory {
  if (!isObject(dto)) {
    throw new ApiError("Category item is invalid.", 500, "INVALID_RESPONSE");
  }

  const categoryDto = dto as CategoryDto;
  const id = readTrimmedString(categoryDto.id);
  const name = readTrimmedString(categoryDto.name);

  if (!id) {
    throw new ApiError("Category id is missing.", 500, "INVALID_RESPONSE");
  }

  if (!name) {
    throw new ApiError("Category name is missing.", 500, "INVALID_RESPONSE");
  }

  return {
    id,
    name,
    categoryType: mapCategoryType(categoryDto.categoryType ?? categoryDto.type),
  };
}

export function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return isObject(value);
}
