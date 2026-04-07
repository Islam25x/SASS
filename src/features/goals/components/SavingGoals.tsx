import { PanelCard, PanelHeader, Text } from "../../../shared/ui";

type Goal = {
  name: string;
  progress: number;
};

const SavingGoals = () => {
  const goals: Goal[] = [
    { name: "Buy a new laptop", progress: 70 },
    { name: "Vacation trip", progress: 45 },
    { name: "Emergency fund", progress: 90 },
  ];

  return (
    <PanelCard className="h-full !w-full">
      <PanelHeader title="Saving Goals" />

      <div className="space-y-4">
        {goals.map((goal, index) => (
          <div key={index}>
            <div className="flex justify-between mb-1">
              <Text as="span" variant="body" weight="medium" className="text-gray-700">
                {goal.name}
              </Text>
              <Text as="span" variant="body" className="text-gray-500">
                {goal.progress}%
              </Text>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-primary-600 h-3 rounded-full"
                style={{ width: `${goal.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </PanelCard>
  );
};

export default SavingGoals;
