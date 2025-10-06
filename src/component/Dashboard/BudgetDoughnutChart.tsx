import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import type {
  ChartOptions,
  ChartData,
  Plugin,
  ChartDataset,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

// ✅ Plugin لكتابة النص في المنتصف
const centerText: Plugin<"doughnut"> = {
  id: "centerText",
  beforeDraw(chart) {
    const { width, height } = chart;
    const ctx = chart.ctx;
    ctx.restore();

    const text = "$5,950.00";
    const subText = "Total for month";

    ctx.fillStyle = "#6b7280";
    ctx.font = "14px 'Inter', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(subText, width / 2, height / 2 - 10);

    ctx.fillStyle = "#111827";
    ctx.font = "bold 20px 'Inter', sans-serif";
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
          "rgba(79,70,229,0.9)",   // بنفسجي
          "rgba(156,163,175,0.9)", // رمادي
          "rgba(31,41,55,0.9)",    // رمادي غامق
          "rgba(167,139,250,0.9)", // بنفسجي فاتح
        ],
        borderColor: "#fff",
        borderWidth: 3,
        cutout: "78%",
        borderRadius: 8,
      } as ChartDataset<"doughnut", number[]>,
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
  };

  const colors = data.datasets[0].backgroundColor as string[];

  return (
    <div className="p-6 box rounded-xl !w-full md:w-[40%] h-80 flex flex-col md:flex-row gap-6">
      {/* ✅ الليجند */}
      <div className="flex-1">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Saving plan</h2>
        <ul className="space-y-2 text-gray-700">
          {data.labels?.map((label, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index] }}
              ></span>
              {String(label)}: ${data.datasets[0].data[index]}
            </li>
          ))}
        </ul>
      </div>

      {/* ✅ الدائرة */}
      <div className="flex-1 flex justify-center items-center">
        <Doughnut
          data={data}
          options={options}
          plugins={[centerText]}
          width={180}
          height={180}
        />
      </div>
    </div>
  );
};

export default BudgetDoughnutChart;
