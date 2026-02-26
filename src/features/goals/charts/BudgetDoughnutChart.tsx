import { memo, useMemo } from "react";
import type { CSSProperties } from "react";
import DoughnutChartBase from "../../../shared/chart/DoughnutChartBase";
import type { DoughnutChartInputData, DoughnutChartInputOptions } from "../../../shared/chart/DoughnutChartBase";

const BudgetDoughnutChart = memo(() => {
  const data = useMemo<DoughnutChartInputData>(
    () => ({
      labels: ["Bills", "Shopping", "Food", "Others"],
      datasets: [
        {
          data: [1500, 2000, 1000, 1450],
          backgroundColor: [
            "rgba(79,70,229,0.9)",
            "rgba(156,163,175,0.9)",
            "rgba(31,41,55,0.9)",
            "rgba(167,139,250,0.9)",
          ],
          borderColor: "#fff",
          borderWidth: 3,
          cutout: "78%",
          borderRadius: 8,
        },
      ],
    }),
    []
  );

  const options = useMemo<DoughnutChartInputOptions>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true },
      },
    }),
    []
  );

  const legendItems = useMemo(
    () =>
      data.labels.map((label, index) => ({
        label: String(label),
        value: data.datasets[0].data[index],
        dotStyle: { backgroundColor: data.datasets[0].backgroundColor[index] } as CSSProperties,
      })),
    [data]
  );

  return (
    <div className="p-6 box rounded-xl !w-full md:w-[40%] h-80 flex flex-col md:flex-row gap-6">
      <div className="flex-1">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Saving plan</h2>
        <ul className="space-y-2 text-gray-700">
          {legendItems.map((item, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <span className="inline-block w-3 h-3 rounded-full" style={item.dotStyle}></span>
              {item.label}: ${item.value}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 flex justify-center items-center">
        <DoughnutChartBase
          data={data}
          options={options}
          width={180}
          height={180}
          className="lg:m-0 mt-[-11rem]"
          centerText="$5,950.00"
          centerSubText="Total for month"
        />
      </div>
    </div>
  );
});

export default BudgetDoughnutChart;
