import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowUp,
  faBell,
  faChartColumn,
  faCircle,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import type { TransactionsSummary } from "../utils/transaction.selectors";
import DashboardSummaryCard from "../../dashboard/components/DashboardSummaryCard";
import { Text } from "../../../shared/ui";

type TransactionsSummaryCardsProps = {
  summary: TransactionsSummary;
  isLoading?: boolean;
};

function formatChange(value: number) {
  return `${Math.abs(value).toFixed(1)}% vs last month`;
}

function TransactionsSummaryCards({
  summary,
  isLoading = false,
}: TransactionsSummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={`summary-skeleton-${index}`}
            className="h-28 rounded-2xl bg-slate-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  const cards = [
    {
      id: "balance",
      title: "Total balance",
      icon: <FontAwesomeIcon icon={faCircle} className="text-green-500" />,
      value: summary.totalBalance,
      change: summary.balanceChange,
    },
    {
      id: "income",
      title: "Income",
      icon: <FontAwesomeIcon icon={faClock} className="text-primary" />,
      value: summary.totalIncome,
      change: summary.incomeChange,
      showArrow: true,
    },
    {
      id: "expenses",
      title: "Expenses",
      icon: <FontAwesomeIcon icon={faChartColumn} className="text-purple-500" />,
      value: summary.totalExpenses,
      change: summary.expensesChange,
      invert: true,
      showArrow: true,
    },
    {
      id: "savings",
      title: "Total savings",
      icon: <FontAwesomeIcon icon={faBell} className="text-yellow-500" />,
      value: summary.totalSavings,
      change: summary.balanceChange,
      showArrow: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const isIncrease = card.invert ? card.change <= 0 : card.change >= 0;
        const changeLabel = formatChange(card.change);

        return (
          <DashboardSummaryCard
            key={card.id}
            title={card.title}
            icon={card.icon}
            value={card.value}
            isIncrease={isIncrease}
            showArrow={card.showArrow}
            changeLabel={
              <>
                <FontAwesomeIcon icon={isIncrease ? faArrowUp : faArrowDown} />
                <Text as="span" variant="body">
                  {changeLabel}
                </Text>
              </>
            }
          />
        );
      })}
    </div>
  );
}

export default TransactionsSummaryCards;
