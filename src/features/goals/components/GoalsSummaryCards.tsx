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
  completedGoals: number;
  inProgressGoals: number;
  totalSaved: number;
  completedPercent: number;
  inProgressPercent: number;
  savedChange: number;
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
      label: `${summary.completedPercent.toFixed(1)}% completed`,
      isIncrease: true,
    },
    {
      id: "completed",
      title: "Completed",
      icon: <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />,
      value: summary.completedGoals,
      label: `${summary.completedPercent.toFixed(1)}%`,
      isIncrease: true,
    },
    {
      id: "in-progress",
      title: "In Progress",
      icon: <FontAwesomeIcon icon={faSpinner} className="text-primary" />,
      value: summary.inProgressGoals,
      label: `${summary.inProgressPercent.toFixed(1)}%`,
      isIncrease: true,
    },
    {
      id: "savings",
      title: "Total savings",
      icon: <FontAwesomeIcon icon={faBell} className="text-yellow-500" />,
      value: summary.totalSaved,
      label: `${Math.abs(summary.savedChange).toFixed(1)}% vs last month`,
      isIncrease: summary.savedChange >= 0,
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
