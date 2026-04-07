import { useMemo } from "react";
import { useTransactions } from "../../../hooks/useTransactions";
import {
  normalizeTransactionType,
  selectRecentTransactions,
} from "../../../application/transactions/transactions.selectors";
import { currencyFormatter, formatTransactionDate } from "../../../application/transactions/transactions.formatters";
import { TransactionType } from "../../../domain/transactions/transaction.enums";
import { Button, PanelCard, PanelHeader, Text } from "../../../shared/ui";

function RecentTransactions() {
  const { data, isLoading, isError, error } = useTransactions();

  const transactions = useMemo(() => data ?? [], [data]);
  const visibleTransactions = useMemo(
    () => selectRecentTransactions(transactions, 3),
    [transactions]
  );

  return (
    <PanelCard className="!w-full">
      <PanelHeader
        title="Recent transactions"
        right={
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="rounded-full px-3 py-1 text-sm text-gray-600 border-gray-200"
            >
              All accounts
            </Button>
          </div>
        }
      />

      {isLoading && (
        <Text variant="body" className="py-8 text-slate-500">
          Loading transactions...
        </Text>
      )}

      {isError && (
        <Text variant="body" className="py-8 text-rose-600">
          {error?.message ?? "Failed to load transactions."}
        </Text>
      )}

      {!isLoading && !isError && transactions.length === 0 && (
        <Text variant="body" className="py-8 text-slate-500">
          No transactions yet.
        </Text>
      )}

      {!isLoading && !isError && visibleTransactions.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-500">
                <th className="py-2">DATE</th>
                <th className="py-2">AMOUNT</th>
                <th className="py-2">merchant</th>
                <th className="py-2">TYPE</th>
                <th className="py-2">CATEGORY</th>
              </tr>
            </thead>
            <tbody>
              {visibleTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-t">
                  <td className="py-3">
                    {formatTransactionDate(transaction.date)}
                  </td>
                  {(() => {
                    const normalizedType = normalizeTransactionType(transaction);
                    const isIncome = normalizedType === TransactionType.Income;
                    const isExpense = normalizedType === TransactionType.Expense;
                    const amountPrefix = isIncome ? "+" : isExpense ? "-" : "";
                    const amountColor = isIncome
                      ? "text-emerald-600"
                      : isExpense
                        ? "text-rose-600"
                        : "text-slate-700";

                    return (
                      <td className={`py-3 font-medium ${amountColor}`}>
                        {amountPrefix} {currencyFormatter.format(Math.abs(transaction.amount))}
                      </td>
                    );
                  })()}
                  <td className="py-3">{transaction.description}</td>
                  <td className="py-3 text-gray-600">
                    {transaction.transaction_type ?? "N/A"}
                  </td>
                  <td className="py-3 text-gray-600">{transaction.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PanelCard>
  );
}

export default RecentTransactions;
