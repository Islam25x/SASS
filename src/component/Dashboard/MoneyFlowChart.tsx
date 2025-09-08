import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MoneyFlowChart = () => {
    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

    const data = {
        labels,
        datasets: [
            {
                label: "Income",
                data: [4000, 3000, 5000, 4500, 6000, 7000, 6500],
                backgroundColor: "rgba(34,197,94,0.7)", // أخضر شفاف
            },
            {
                label: "Expenses",
                data: [2500, 2000, 3000, 2800, 3500, 4000, 3700],
                backgroundColor: "rgba(239,68,68,0.7)", // أحمر شفاف
            },
            {
                label: "Savings",
                data: [1500, 1000, 2000, 1700, 2500, 3000, 2800],
                backgroundColor: "rgba(59,130,246,0.7)", // أزرق شفاف
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: "Money Flow Overview",
            },
        },
    };

    return (
        <div className="p-6 border-[1px] bg-white border-gray-400 border-solid rounded-xl w-full h-72">
            <Bar className="!w-full" data={data} options={options}  />
        </div>
    );
};

export default MoneyFlowChart;
