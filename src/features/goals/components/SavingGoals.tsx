import { useMemo } from "react";
import { PanelCard, PanelHeader, Text } from "../../../shared/ui";
import { useGoals } from "../../../hooks/useGoals";

const SavingGoals = () => {
  const { data } = useGoals();
  const goals = useMemo(() => (data ?? []).slice(0, 3), [data]);

  return (
    <PanelCard className="h-full !w-full">
      <PanelHeader title="Saving Goals" />

      <div className="space-y-4">
        {goals.length === 0 && (
          <Text variant="body" className="text-gray-500">
            No goals yet
          </Text>
        )}
        {goals.map((goal) => (
          <div key={goal.id}>
            <div className="flex justify-between mb-1">
              <Text as="span" variant="body" weight="medium" className="text-gray-700">
                {goal.title}
              </Text>
              <Text as="span" variant="body" className="text-gray-500">
                {goal.durationValue.toFixed(2)} mo
              </Text>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-primary-600 h-3 rounded-full"
                style={{
                  width: `${Math.min((goal.monthlyAmount / goal.targetAmount) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </PanelCard>
  );
};

export default SavingGoals;
