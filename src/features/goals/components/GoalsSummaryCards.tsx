import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faBullseye,
  faCheckCircle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import {
  MetricCard,
  TrendIndicator,
} from "../../../shared/ui";
import { createStaticTrendPresentation } from "../../../shared/utils/metric-trend";

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
    },
    {
      id: "target",
      title: "Target Amount",
      icon: <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />,
      value: summary.totalTargetAmount,
      label: "Combined goal target",
    },
    {
      id: "monthly",
      title: "Monthly Total",
      icon: <FontAwesomeIcon icon={faSpinner} className="text-primary" />,
      value: summary.totalMonthlyAmount,
      label: `${summary.averageDuration.toFixed(1)} average months`,
    },
    {
      id: "duration",
      title: "Longest Duration",
      icon: <FontAwesomeIcon icon={faBell} className="text-yellow-500" />,
      value: summary.longestDuration,
      label: "Months to finish the longest goal",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <MetricCard
          key={card.id}
          title={card.title}
          icon={card.icon}
          value={card.value}
          trendContent={
            <TrendIndicator
              trend={createStaticTrendPresentation(card.label, "neutral")}
            />
          }
        />
      ))}
    </div>
  );
}

export type { GoalsSummary };
export default GoalsSummaryCards;
