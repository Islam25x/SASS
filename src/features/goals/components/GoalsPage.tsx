import { useMemo, useState } from "react";
import { Search, Laptop, Plane, HeartPulse, Smartphone, PiggyBank } from "lucide-react";
import { Button, Input, PageHeader } from "../../../shared/ui";
import GoalsSummaryCards, { type GoalsSummary } from "./GoalsSummaryCards";
import GoalsListCard from "./GoalsListCard";
import GoalsInsightsCard from "./GoalsInsightsCard";
import type { Goal } from "./goals.types";

const goalsData: Goal[] = [
  {
    id: "goal-1",
    title: "Buy a new laptop",
    saved: 700,
    target: 1000,
    deadline: "15 Aug",
    status: "In Progress",
    icon: <Laptop size={18} />,
  },
  {
    id: "goal-2",
    title: "Vacation trip",
    saved: 900,
    target: 2000,
    deadline: "05 Sept",
    status: "In Progress",
    icon: <Plane size={18} />,
  },
  {
    id: "goal-3",
    title: "Emergency fund",
    saved: 1500,
    target: 1500,
    deadline: "15 Aug",
    status: "Completed",
    icon: <HeartPulse size={18} />,
  },
  {
    id: "goal-4",
    title: "New smartphone",
    saved: 0,
    target: 800,
    deadline: "20 Sept",
    status: "Not Started",
    icon: <Smartphone size={18} />,
  },
  {
    id: "goal-5",
    title: "Family savings",
    saved: 0,
    target: 750,
    deadline: "30 Sept",
    status: "Not Started",
    icon: <PiggyBank size={18} />,
  },
];

const PAGE_SIZE = 2;

function GoalsPage() {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredGoals = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return goalsData;
    }
    return goalsData.filter((goal) =>
      goal.title.toLowerCase().includes(normalized)
    );
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(filteredGoals.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pagedGoals = filteredGoals.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const summary: GoalsSummary = useMemo(() => {
    const totalGoals = goalsData.length;
    const completedGoals = goalsData.filter((goal) => goal.status === "Completed").length;
    const inProgressGoals = goalsData.filter((goal) => goal.status === "In Progress").length;
    const totalSaved = goalsData.reduce((acc, goal) => acc + goal.saved, 0);
    const totalTarget = goalsData.reduce((acc, goal) => acc + goal.target, 0);
    const completedPercent = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;
    const inProgressPercent = totalGoals > 0 ? (inProgressGoals / totalGoals) * 100 : 0;
    const savedChange = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

    return {
      totalGoals,
      completedGoals,
      inProgressGoals,
      totalSaved,
      completedPercent,
      inProgressPercent,
      savedChange,
    };
  }, []);

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
          <GoalsListCard goals={pagedGoals} totalCount={filteredGoals.length} />

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
        <GoalsInsightsCard goals={goalsData} />
      </div>
    </div>
  );
}

export default GoalsPage;
