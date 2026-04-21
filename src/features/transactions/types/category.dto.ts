import type { AddTransactionType } from "./add-transaction.types";

export interface TransactionCategoryDto {
  id?: unknown;
  name?: unknown;
  categoryType?: unknown;
  type?: unknown;
}

export interface CreateCategoryRequestDto {
  name: string;
  type: AddTransactionType;
}
