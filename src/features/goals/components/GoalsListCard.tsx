import { Button, PanelCard, PanelHeader, Text } from "../../../shared/ui";
import type { Goal } from "../../../domain/goals/goal.schema";
import GoalsList from "./GoalsList";

type GoalsListCardProps = {
  goals: Goal[];
  totalCount?: number;
  onAddGoal: () => void;
};

function GoalsListCard({ goals, totalCount, onAddGoal }: GoalsListCardProps) {
  const countLabel = totalCount ?? goals.length;

  return (
    <PanelCard>
      <PanelHeader
        title={`Your Goals`}
        right={
          <div className="flex items-center gap-3">
            <Text variant="body" className="text-gray-500">
              [{countLabel} goals]
            </Text>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={onAddGoal}
              className="flex items-center gap-2 rounded-full px-4 py-2 text-xs shadow-sm"
            >
              <span className="text-base leading-none">+</span>
              Add Goal
            </Button>
          </div>
        }
      />

      <GoalsList goals={goals} />
    </PanelCard>
  );
}

export default GoalsListCard;
