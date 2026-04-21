export type AddTransactionType = "Expense" | "Income";
export type AddTransactionTypeInput = AddTransactionType | "expense" | "income";

export interface AddTransactionInput {
  transactionName: string;
  amount: number;
  type: AddTransactionTypeInput;
  categoryId: string;
  categoryType: AddTransactionTypeInput;
  occurredAt: string;
}

export interface AddTransactionPayload {
  amount: number;
  type: AddTransactionType;
  categoryId: string;
  notes: string;
  occurredAt: string;
}
