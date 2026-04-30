import type { AddTransactionType } from "../types/add-transaction.types";

export interface TransactionCategoryDto {
  id?: unknown;
  name?: unknown;
  categoryType?: unknown;
  type?: unknown;
}

export interface CreateCategoryRequestDto {
  name: string;
  categoryType: AddTransactionType;
}
