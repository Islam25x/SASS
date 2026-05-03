import { memo, useMemo } from "react";
import type { CSSProperties } from "react";
import DoughnutChartBase from "../../../shared/chart/DoughnutChartBase";
import type {
  DoughnutChartInputData,
  DoughnutChartInputOptions,
} from "../../../shared/chart/DoughnutChartBase";
import { Card, Text } from "../../../shared/ui";
import { useDashboard } from "../hooks/useDashboard";

const CHART_COLORS = [
  "#6366F1", // Indigo
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#06B6D4", // Cyan
  "#8B5CF6", // Violet
];

const BudgetDoughnutChart = memo(() => {
  const { data: dashboard } = useDashboard();

  const expenseBreakdown = dashboard?.expenseBreakdown ?? [];

  const totalExpenses = dashboard?.totalExpense ?? 0;

  const formattedTotalExpenses = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(totalExpenses),
    [totalExpenses],
  );

  const data = useMemo<DoughnutChartInputData>(
    () => ({
      labels: expenseBreakdown.map((item) => item.categoryName),

      datasets: [
        {
          data: expenseBreakdown.map((item) => item.amount),

          backgroundColor: expenseBreakdown.map(
            (_, index) => CHART_COLORS[index % CHART_COLORS.length],
          ),

          borderColor: "#ffffff",
          borderWidth: 2,
          cutout: "82%",
          borderRadius: 5,
        },
      ],
    }),
    [expenseBreakdown],
  );

  const options = useMemo<DoughnutChartInputOptions>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: {
          display: false,
        },

        tooltip: {
          enabled: true,
        },
      },
    }),
    [],
  );

  const legendItems = useMemo(
    () =>
      expenseBreakdown.map((item, index) => ({
        label: item.categoryName,
        value: item.amount,

        dotStyle: {
          backgroundColor:
            CHART_COLORS[index % CHART_COLORS.length],
        } as CSSProperties,
      })),
    [expenseBreakdown],
  );

  return (
    <Card
      variant="default"
      padding="md"
      className="flex h-full w-full flex-col gap-4 lg:flex-row"
    >
      <div className="flex flex-1 flex-col">
        <Text
          as="h2"
          variant="subtitle"
          weight="bold"
          className="mb-3 text-slate-900"
        >
          Expense Breakdown
        </Text>

        {legendItems.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <Text variant="body" className="text-xs text-slate-500">
              No expense data available
            </Text>
          </div>
        ) : (
          <ul className="space-y-1.5">
            {legendItems.map((item, index) => (
              <li
                key={`${item.label}-${index}`}
                className="flex items-center justify-between gap-2 rounded-md bg-slate-50/70 px-2 py-1 text-[11px]"
              >
                <div className="flex min-w-0 items-center gap-1.5">
                  <span
                    className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                    style={item.dotStyle}
                  />

                  <span className="max-w-[72px] truncate text-slate-700">
                    {item.label}
                  </span>
                </div>

                <span className="text-[11px] font-semibold text-slate-900">
                  ${item.value}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="relative flex items-center justify-center">
          <DoughnutChartBase
            data={data}
            options={options}
            width={165}
            height={165}
          />

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[11px] font-medium text-slate-500">
              Expenses
            </span>

            <span className="text-xl font-bold tracking-tight text-slate-900">
              {formattedTotalExpenses}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
});

BudgetDoughnutChart.displayName = "BudgetDoughnutChart";

export default BudgetDoughnutChart;