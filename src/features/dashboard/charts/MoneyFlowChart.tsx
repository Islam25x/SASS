import { memo, useMemo } from "react";
import LineChartBase from "../../../shared/chart/LineChartBase";
import type { LineChartRow } from "../../../shared/chart/LineChartBase";


const MoneyFlowChart = () => {
  const chartData = useMemo<LineChartRow[]>(
    () => [
      { label: "Jan", income: 4000, expenses: 2500, savings: 1500 },
      { label: "Feb", income: 3000, expenses: 2000, savings: 1000 },
      { label: "Mar", income: 5000, expenses: 3000, savings: 2000 },
      { label: "Apr", income: 4500, expenses: 2800, savings: 1700 },
      { label: "May", income: 6000, expenses: 3500, savings: 2500 },
      { label: "Jun", income: 7000, expenses: 4000, savings: 3000 },
      { label: "Jul", income: 6500, expenses: 3700, savings: 2800 },
    ],
    []
  );

  const series = useMemo(
    () => [
      {
        dataKey: "income",
        stroke: "#8B5CF6",
        fill: "rgba(139,92,246,0.15)",
      },
      {
        dataKey: "expenses",
        stroke: "#F43F5E",
        fill: "rgba(244,63,94,0.15)",
      },
      {
        dataKey: "savings",
        stroke: "#6366F1",
        fill: "rgba(99,102,241,0.15)",
      },
    ],
    []
  );

  const legendItems = useMemo(
    () => [
      { label: "Income", color: "#8B5CF6" },
      { label: "Expenses", color: "#F43F5E" },
      { label: "Savings", color: "#6366F1" },
    ],
    []
  );

  return (
    <div className="box rounded-xl relative w-full h-80 flex flex-col">
      <div className="flex items-center justify-between my-4 mx-6">
        <h2 className="text-gray-900 font-semibold text-md my-1">
          Money Flow
        </h2>
        {/* <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-black/60 backdrop-blur-xs z-40 text-center p-6">
          <p className="text-gray-800 font-medium mb-2">Please enter your income data</p>
          <p className="text-white text-sm mb-4">We need your income to show the Money Flow chart.</p>
        </div> */}

        <div className="flex items-center gap-4">
          {legendItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-700 font-medium">
                {item.label}
              </span>
            </div>
          ))}

          <button className="px-3 py-1 border rounded-full text-sm text-gray-600 hover:bg-gray-100">
            All accounts
          </button>

          <button className="px-3 py-1 border rounded-full text-sm text-gray-600 hover:bg-gray-100">
            See all
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-15 px-6 pb-6">
        <LineChartBase data={chartData} series={series} />
      </div>
    </div>
  );
};

export default memo(MoneyFlowChart);
