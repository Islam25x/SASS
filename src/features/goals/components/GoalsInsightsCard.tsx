import { PanelCard, PanelHeader, Text } from "../../../shared/ui";
import type { Goal } from "./goals.types";
import { Lightbulb, Target, TrendingUp } from "lucide-react";

type GoalsInsightsCardProps = {
  goals: Goal[];
};

function GoalsInsightsCard({ goals }: GoalsInsightsCardProps) {
  const activeGoal = goals[0];
  const savedPercent =
    activeGoal && activeGoal.target > 0 ? (activeGoal.saved / activeGoal.target) * 100 : 0;
  const remaining = activeGoal ? Math.max(activeGoal.target - activeGoal.saved, 0) : 0;

  return (
    <PanelCard>
      <PanelHeader
        title="Insights"
        right={
          <Text as="span" variant="body" className="text-gray-400">
            ...
          </Text>
        }
      />

      <div className="space-y-4 text-sm text-gray-700">
        <div className="flex items-start gap-3">
          <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <TrendingUp size={16} />
          </span>
          <div>
            <Text variant="body" weight="bold" className="text-gray-900">
              You&apos;re {savedPercent.toFixed(0)}% closer to your goal
            </Text>
            <Text variant="body" className="text-gray-500">
              Keep the momentum going.
            </Text>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Target size={16} />
          </span>
          <div>
            <Text variant="body" weight="bold" className="text-gray-900">
              You need ${remaining}
            </Text>
            <Text variant="body" className="text-gray-500">
              To hit your target.
            </Text>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Lightbulb size={16} />
          </span>
          <div>
            <Text variant="body" weight="bold" className="text-gray-900">
              Tip
            </Text>
            <Text variant="body" className="text-gray-500">
              Automate a weekly transfer.
            </Text>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-lg bg-gray-100 p-4 text-sm text-gray-600">
        <div className="flex items-center justify-between">
          <Text as="span" variant="body">
            Goal: {activeGoal?.title ?? "N/A"}
          </Text>
          <Text as="span" variant="body">
            ${activeGoal?.target.toLocaleString() ?? "0"}
          </Text>
        </div>
        <div className="mt-3 h-20 rounded-lg bg-gray-200" aria-hidden="true" />
        <Text variant="body" className="mt-3 text-gray-500">
          ${activeGoal?.saved.toLocaleString() ?? "0"} / $
          {activeGoal?.target.toLocaleString() ?? "0"} Saved
        </Text>
      </div>
    </PanelCard>
  );
}

export default GoalsInsightsCard;
