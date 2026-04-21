import { Card, Text } from "../../../shared/ui";
import type { Goal } from "../../../domain/goals/goal.schema";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

type GoalsListProps = {
  goals: Goal[];
};

function GoalsList({ goals }: GoalsListProps) {
  if (goals.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface px-5 py-8 text-center">
        <Text variant="body" weight="bold" className="text-gray-900">
          No goals yet
        </Text>
        <Text variant="body" className="mt-2 text-gray-500">
          Start by creating your first goal
        </Text>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {goals.map((goal) => (
        <Card key={goal.id} variant="outline" padding="sm" className="bg-white">
          <div className="space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <Text variant="body" weight="bold" className="text-gray-900">
                  {goal.title}
                </Text>
                <Text variant="body" className="mt-1 text-gray-500">
                  {goal.description || "No description provided"}
                </Text>
              </div>
              <Text variant="body" weight="bold" className="text-gray-900">
                {currencyFormatter.format(goal.targetAmount)}
              </Text>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-gray-50 px-4 py-3">
                <Text variant="caption" className="text-gray-500">
                  Target Amount
                </Text>
                <Text variant="body" weight="bold" className="mt-1 text-gray-900">
                  {currencyFormatter.format(goal.targetAmount)}
                </Text>
              </div>
              <div className="rounded-xl bg-gray-50 px-4 py-3">
                <Text variant="caption" className="text-gray-500">
                  Monthly Amount
                </Text>
                <Text variant="body" weight="bold" className="mt-1 text-gray-900">
                  {currencyFormatter.format(goal.monthlyAmount)}
                </Text>
              </div>
              <div className="rounded-xl bg-gray-50 px-4 py-3">
                <Text variant="caption" className="text-gray-500">
                  Duration
                </Text>
                <Text variant="body" weight="bold" className="mt-1 text-gray-900">
                  {goal.durationValue.toFixed(2)} {goal.durationUnit}
                </Text>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default GoalsList;
