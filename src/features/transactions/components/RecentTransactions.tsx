import { useMemo } from "react";
import { useTransactions } from "../../../hooks/useTransactions";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

function RecentTransactions() {
  const { data, isLoading, isError, error } = useTransactions();

  const transactions = useMemo(() => data ?? [], [data]);
  const visibleTransactions = useMemo(() => transactions.slice(0, 3), [transactions]);

  return (
    <div className="rounded-xl box p-6 !w-full">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent transactions</h2>
        <div className="flex gap-2">
          <button className="rounded-full border px-3 py-1 text-sm text-gray-600 hover:bg-gray-100">
            All accounts
          </button>
        </div>
      </div>

      {isLoading && <p className="py-8 text-sm text-slate-500">Loading transactions...</p>}

      {isError && (
        <p className="py-8 text-sm text-rose-600">
          {error?.message ?? "Failed to load transactions."}
        </p>
      )}

      {!isLoading && !isError && transactions.length === 0 && (
        <p className="py-8 text-sm text-slate-500">No transactions yet.</p>
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
                    {transaction.date
                      ? dateFormatter.format(new Date(transaction.date))
                      : "N/A"}
                  </td>
                  {(() => {
                    const normalizedType = (transaction.transaction_type ?? "")
                      .toLowerCase()
                      .trim();
                    const isIncome = normalizedType === "income";
                    const isExpense =
                      normalizedType === "expense" || normalizedType === "expence";
                    const amountPrefix = isIncome ? "+" : isExpense ? "-" : "";
                    const amountColor = isIncome
                      ? "text-emerald-600"
                      : isExpense
                        ? "text-rose-600"
                        : "text-slate-700";

                    return (
                      <td className={`py-3 font-medium ${amountColor}`}>
                        {amountPrefix} {currencyFormatter.format(transaction.amount)}
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
    </div>
  );
}

export default RecentTransactions;
