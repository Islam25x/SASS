export type TransactionsApiTypeFilter = "Income" | "Expense";

export interface TransactionsFilters {
  type?: TransactionsApiTypeFilter | null;
  categoryId?: string | null;
  fromDate?: string | null;
  toDate?: string | null;
  pageNumber?: number;
  pageSize?: number;
}

export type TransactionsTypeUiFilter = "all" | "income" | "expense";
