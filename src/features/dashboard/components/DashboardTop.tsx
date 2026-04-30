import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faChartColumn,
  faBell,
  faCircle,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import DashboardSummaryCard from "./DashboardSummaryCard";
import { PageHeader, Text } from "../../../shared/ui";
import { useUserProfile } from "../../../features/user/hooks/useUserProfile";
import { getUserDisplayName } from "../../../features/user/utils/user.selectors";
import { useDashboardSummary } from "../hooks/useDashboard";
import { useState } from "react";
import AddTransactionModal from "../../transactions/components/AddTransactionModal";
import AdjustBalanceModal from "./AdjustBalanceModal";

type ForcedTransactionType = "income" | "expense" | null;

const DashboardTop = () => {
  const { data: profile } = useUserProfile();
  const { data: summary } = useDashboardSummary();
  const displayName = profile ? getUserDisplayName(profile) : "Finexa User";
  const [forcedTransactionType, setForcedTransactionType] =
    useState<ForcedTransactionType>(null);
  const [isAdjustBalanceOpen, setIsAdjustBalanceOpen] = useState(false);

  const dashboardItems = [
    {
      titleKey: "Available Balance",
      icon: <FontAwesomeIcon icon={faCircle} className="text-green-500" />,
      value: summary?.totalBalance ?? 0,
      pev: "0% vs last period",
      isIncrease: true,
      arrow: true,
      onArrowClick: () => setIsAdjustBalanceOpen(true),
    },
    {
      titleKey: "Income",
      icon: <FontAwesomeIcon icon={faClock} className="text-primary" />,
      value: summary?.totalIncome ?? 0,
      pev: summary?.incomeChangePercentage.label ?? "0% vs last period",
      isIncrease: summary?.incomeChangePercentage.trend !== "down",
      arrow: true,
      onArrowClick: () => setForcedTransactionType("income"),
    },
    {
      titleKey: "Expenses",
      icon: <FontAwesomeIcon icon={faChartColumn} className="text-purple-500" />,
      value: summary?.totalExpense ?? 0,
      pev: summary?.expenseChangePercentage.label ?? "0% vs last period",
      isIncrease: summary?.expenseChangePercentage.trend !== "down",
      arrow: true,
      onArrowClick: () => setForcedTransactionType("expense"),
    },
    {
      titleKey: "savings for this month",
      icon: <FontAwesomeIcon icon={faBell} className="text-yellow-500" />,
      value: summary?.totalSavings ?? 0,
      pev: summary?.savingsChangePercentage.label ?? "0% vs last period",
      isIncrease: summary?.savingsChangePercentage.trend !== "down",
      arrow: false
    },
  ];

  return (
    <section id="DashboardTop" className="container mt-5 px-3 pb-8 space-y-5">
      <PageHeader
        title={`Welcome back, ${displayName}`}
        subtitle="Welcome to your dashboard"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardItems.map((item, index) => (
          <DashboardSummaryCard
            key={index}
            title={item.titleKey}
            icon={item.icon}
            value={item.value}
            changeLabel={
              <>
                <FontAwesomeIcon
                  icon={item.isIncrease ? faArrowUp : faArrowDown}
                />
                <Text as="span" variant="body">
                  {item.pev}
                </Text>
              </>
            }
            isIncrease={item.isIncrease}
            showArrow={item.arrow}
            onArrowClick={item.onArrowClick}
          />
        ))}
      </div>

      <AddTransactionModal
        isOpen={forcedTransactionType !== null}
        onClose={() => setForcedTransactionType(null)}
        mode="create"
        forcedType={forcedTransactionType ?? undefined}
      />
      <AdjustBalanceModal
        isOpen={isAdjustBalanceOpen}
        currentBalance={summary?.totalBalance ?? 0}
        onClose={() => setIsAdjustBalanceOpen(false)}
      />
    </section>
  );
};

export default DashboardTop;
