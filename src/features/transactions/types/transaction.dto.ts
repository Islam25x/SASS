export interface TransactionResponseDto {
  transactionId: string;
  amount: number;
  type: "Income" | "Expense";
  categoryId?: string | null;
  merchant?: string | null;
  item?: string | null;
  notes?: string | null;
  occurredAt: string;
  categoryName?: string | null;
  source?: string | null;
}
