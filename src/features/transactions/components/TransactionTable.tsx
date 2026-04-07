import type { TransactionRowData } from "../../../application/transactions/transactions.selectors";
import TransactionRow from "./TransactionRow";
import TransactionSectionHeader from "./TransactionSectionHeader";
import EmptyState from "./EmptyState";
import { PanelCard } from "../../../shared/ui";
import { Text } from "../../../shared/ui";

type TransactionTableProps = {
  rows: TransactionRowData[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  count: number;
};

function TransactionTable({
  rows,
  isLoading,
  isError,
  errorMessage,
  count,
}: TransactionTableProps) {
  return (
    <PanelCard>
      <TransactionSectionHeader count={count} />

      {isLoading && (
        <div className="space-y-3 py-6">
          {[0, 1, 2, 3, 4].map((row) => (
            <div
              key={row}
              className="h-10 w-full animate-pulse rounded-lg bg-slate-100"
            />
          ))}
        </div>
      )}

      {isError && !isLoading && (
        <Text variant="body" className="py-8 text-rose-600">
          {errorMessage ?? "Failed to load transactions."}
        </Text>
      )}

      {!isLoading && !isError && rows.length === 0 && <EmptyState />}

      {!isLoading && !isError && rows.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-500">
                <th className="py-2">DATE</th>
                <th className="py-2">AMOUNT</th>
                <th className="py-2">MERCHANT</th>
                <th className="py-2">TYPE</th>
                <th className="py-2">CATEGORY</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((transaction) => (
                <TransactionRow key={transaction.id} transaction={transaction} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PanelCard>
  );
}

export default TransactionTable;
