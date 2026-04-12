import { Button, Card, PanelCard, PanelHeader, Text } from "../../../shared/ui";
import type { Goal } from "./goals.types";

type GoalsListCardProps = {
  goals: Goal[];
  totalCount?: number;
};

function GoalsListCard({ goals, totalCount }: GoalsListCardProps) {
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
              variant="primary"
              size="sm"
              className="flex items-center gap-2 rounded-full px-4 py-2 text-xs shadow-sm"
            >
              <span className="text-base leading-none">+</span>
              Add Goal
            </Button>
          </div>
        }
      />

      <div className="space-y-4">
        {goals.map((goal) => {
          const progress = goal.target > 0 ? (goal.saved / goal.target) * 100 : 0;
          const statusClass =
            goal.status === "Completed"
              ? "bg-primary/10 text-primary-700"
              : goal.status === "In Progress"
                ? "bg-primary/10 text-primary-700"
                : "bg-gray-100 text-gray-600";

          return (
            <Card key={goal.id} variant="outline" padding="sm" className="bg-white">
              <div className="flex flex-col gap-3 ">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      {goal.icon}
                    </div>
                    <div>
                      <Text variant="body" weight="bold" className="text-gray-900">
                        {goal.title}
                      </Text>
                      <Text variant="body" className="text-gray-500">
                        Deadline: {goal.deadline}
                      </Text>
                    </div>
                  </div>
                  <Text variant="body" weight="bold" className="text-gray-900">
                    ${goal.saved.toLocaleString()} / ${goal.target.toLocaleString()} Saved
                  </Text>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Text
                    as="span"
                    variant="caption"
                    weight="bold"
                    className={`rounded-full px-3 py-1 ${statusClass}`}
                  >
                    {goal.status}
                  </Text>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="rounded-full px-3 py-1 text-xs text-gray-600 border-gray-200"
                    >
                      Add Money
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="rounded-full px-3 py-1 text-xs text-gray-600 border-gray-200"
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </PanelCard>
  );
}

export default GoalsListCard;
