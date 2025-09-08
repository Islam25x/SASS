import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import type { ChartOptions, ChartData, Plugin } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

// Plugin لكتابة النص في النص
const centerText: Plugin<"doughnut"> = {
  id: "centerText",
  beforeDraw(chart) {
    const { width, height } = chart;
    const ctx = chart.ctx;
    ctx.restore();

    const text = "$5,950.00";
    const subText = "Total for month";

    // Sub text
    ctx.fillStyle = "#6b7280"; // رمادي
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(subText, width / 2, height / 2 - 10);

    // Main text
    ctx.fillStyle = "#000";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText(text, width / 2, height / 2 + 15);

    ctx.save();
  },
};

const BudgetDoughnutChart = () => {
  const data: ChartData<"doughnut"> = {
    labels: ["Bills", "Shopping", "Food", "Others"],
    datasets: [
      {
        data: [1500, 2000, 1000, 1450],
        backgroundColor: [
          "rgba(79,70,229,0.8)",   // بنفسجي
          "rgba(156,163,175,0.8)", // رمادي
          "rgba(31,41,55,0.8)",    // أسود رمادي
          "rgba(167,139,250,0.8)", // بنفسجي فاتح
        ],
        borderWidth: 0,
        cutout: "70%", // يخليها Doughnut
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: false,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // مخفي لأننا هنعمله يدوي
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  const colors = data.datasets[0].backgroundColor as string[];

  return (
    <div className="p-6 border bg-white border-gray-400 rounded-xl w-[40%] h-72 flex">
      {/* الليجند */}
      <div className="left">
        <h2 className="text-lg font-semibold mb-4">Budget</h2>
        <ul className="space-y-2">
          {data.labels?.map((label, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index] }}
              ></span>
              {label}: {data.datasets[0].data[index]}
            </li>
          ))}
        </ul>
      </div>

      {/* الرسمه */}
      <Doughnut
        data={data}
        options={options}
        plugins={[centerText]}
        width={180}
        height={180}
        style={{ margin: "2rem 0 0 auto" }}
      />
    </div>
  );
};

export default BudgetDoughnutChart;
