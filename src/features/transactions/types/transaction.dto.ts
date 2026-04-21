export interface TransactionResponseDto {
  transactionId: string;
  amount: number;
  type: "Income" | "Expense";
  notes: string;
  occurredAt: string;
  categoryName: string;
  source?: string;
}
