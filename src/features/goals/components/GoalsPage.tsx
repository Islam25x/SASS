import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Button, Input, PageHeader } from "../../../shared/ui";
import GoalsSummaryCards, { type GoalsSummary } from "./GoalsSummaryCards";
import GoalsListCard from "./GoalsListCard";
import GoalsInsightsCard from "./GoalsInsightsCard";
import { useGoals } from "../hooks/useGoals";
import CreateGoalModal from "./CreateGoalModal";

const PAGE_SIZE = 6;

function GoalsPage() {
  const { data, isLoading } = useGoals();
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const goals = useMemo(() => data ?? [], [data]);

  const filteredGoals = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return goals;
    }
    return goals.filter((goal) =>
      goal.title.toLowerCase().includes(normalized) ||
      goal.description.toLowerCase().includes(normalized)
    );
  }, [goals, query]);

  const totalPages = Math.max(1, Math.ceil(filteredGoals.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pagedGoals = filteredGoals.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const summary: GoalsSummary = useMemo(() => {
    const totalGoals = goals.length;
    const totalTargetAmount = goals.reduce((acc, goal) => acc + goal.targetAmount, 0);
    const totalMonthlyAmount = goals.reduce((acc, goal) => acc + goal.monthlyAmount, 0);
    const averageDuration =
      totalGoals > 0
        ? goals.reduce((acc, goal) => acc + goal.durationValue, 0) / totalGoals
        : 0;
    const longestDuration = goals.reduce(
      (acc, goal) => Math.max(acc, goal.durationValue),
      0,
    );

    return {
      totalGoals,
      totalTargetAmount,
      totalMonthlyAmount,
      averageDuration,
      longestDuration,
    };
  }, [goals]);

  return (
    <div className="space-y-5">
      <PageHeader title="Goals" subtitle="Stay consistent and hit your targets." />

      <div className="relative w-full md:max-w-sm">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <Input
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search Goals..."
          className="pl-10"
        />
      </div>

      <GoalsSummaryCards summary={summary} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              {[0, 1].map((row) => (
                <div
                  key={row}
                  className="h-72 w-full animate-pulse rounded-2xl bg-slate-100"
                />
              ))}
            </div>
          ) : (
            <GoalsListCard
              goals={pagedGoals}
              totalCount={filteredGoals.length}
              onAddGoal={() => setIsCreateOpen(true)}
            />
          )}

          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <Button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                variant={page === safePage ? "primary" : "secondary"}
                size="sm"
                className={`h-9 w-9 rounded-lg text-sm font-medium ${
                  page === safePage
                    ? "border-primary"
                    : "border-gray-200 text-gray-600"
                }`}
              >
                {page}
              </Button>
            ))}
          </div>
        </div>
        <GoalsInsightsCard goals={goals} />
      </div>

      <CreateGoalModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
}

export default GoalsPage;
