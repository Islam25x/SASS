export const TransactionType = {
  Income: "income",
  Expense: "expense",
} as const;

export type TransactionType =
  (typeof TransactionType)[keyof typeof TransactionType];

export const TransactionCategory = {
  Income: "Income",
  Salary: "Salary",
  Food: "Food",
  Transport: "Transport",
  Shopping: "Shopping",
  Utilities: "Utilities",
  Entertainment: "Entertainment",
  Health: "Health",
  Transfer: "Transfer",
  Other: "Other",
} as const;

export type TransactionCategory =
  (typeof TransactionCategory)[keyof typeof TransactionCategory];
