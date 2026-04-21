import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowUp,
  faBell,
  faBullseye,
  faCheckCircle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import DashboardSummaryCard from "../../dashboard/components/DashboardSummaryCard";
import { Text } from "../../../shared/ui";

type GoalsSummary = {
  totalGoals: number;
  totalTargetAmount: number;
  totalMonthlyAmount: number;
  averageDuration: number;
  longestDuration: number;
};

type GoalsSummaryCardsProps = {
  summary: GoalsSummary;
};

function GoalsSummaryCards({ summary }: GoalsSummaryCardsProps) {
  const cards = [
    {
      id: "total",
      title: "Total Goals",
      icon: <FontAwesomeIcon icon={faBullseye} className="text-primary" />,
      value: summary.totalGoals,
      label: "Tracked from your current plan",
      isIncrease: true,
    },
    {
      id: "target",
      title: "Target Amount",
      icon: <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />,
      value: summary.totalTargetAmount,
      label: "Combined goal target",
      isIncrease: true,
    },
    {
      id: "monthly",
      title: "Monthly Total",
      icon: <FontAwesomeIcon icon={faSpinner} className="text-primary" />,
      value: summary.totalMonthlyAmount,
      label: `${summary.averageDuration.toFixed(1)} average months`,
      isIncrease: true,
    },
    {
      id: "duration",
      title: "Longest Duration",
      icon: <FontAwesomeIcon icon={faBell} className="text-yellow-500" />,
      value: summary.longestDuration,
      label: "Months to finish the longest goal",
      isIncrease: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
          <DashboardSummaryCard
            key={card.id}
            title={card.title}
            icon={card.icon}
            value={card.value}
            isIncrease={card.isIncrease}
          changeLabel={
            <>
              <FontAwesomeIcon icon={card.isIncrease ? faArrowUp : faArrowDown} />
              <Text as="span" variant="body">
                {card.label}
              </Text>
            </>
          }
        />
      ))}
    </div>
  );
}

export type { GoalsSummary };
export default GoalsSummaryCards;
