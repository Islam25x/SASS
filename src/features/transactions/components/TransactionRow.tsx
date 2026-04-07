import type { TransactionRowData } from "../../../application/transactions/transactions.selectors";
import { formatTransactionDate } from "../../../application/transactions/transactions.formatters";
import AmountText from "./AmountText";
import CategoryBadge from "./CategoryBadge";
import { Text } from "../../../shared/ui";

type TransactionRowProps = {
  transaction: TransactionRowData;
};

function TransactionRow({ transaction }: TransactionRowProps) {
  const typeLabel =
    transaction.type === "unknown"
      ? "N/A"
      : `${transaction.type.charAt(0).toUpperCase()}${transaction.type.slice(1)}`;

  return (
    <tr className="border-t cursor-pointer transition hover:bg-slate-50">
      <td className="py-3 text-sm text-gray-700">
        <Text as="span" variant="body" className="text-gray-700">
          {formatTransactionDate(transaction.date)}
        </Text>
      </td>
      <td className="py-3 text-sm">
        <AmountText amount={transaction.amount} type={transaction.type} />
      </td>
      <td className="py-3 text-sm font-semibold text-gray-800">
        <Text as="span" variant="body" weight="bold" className="text-gray-800">
          {transaction.merchant}
        </Text>
      </td>
      <td className="py-3 text-sm text-gray-600">
        <Text as="span" variant="body" className="text-gray-600">
          {typeLabel}
        </Text>
      </td>
      <td className="py-3 text-sm">
        <CategoryBadge
          category={transaction.category}
          label={transaction.rawCategory ?? transaction.category}
        />
      </td>
    </tr>
  );
}

export default TransactionRow;
