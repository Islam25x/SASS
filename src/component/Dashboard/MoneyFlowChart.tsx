import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MoneyFlowChart: React.FC = () => {
    const data = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        datasets: [
            {
                label: "Income",
                data: [4000, 3000, 5000, 4500, 6000, 7000, 6500],
                borderColor: "#8B5CF6", // بنفسجي أنيق
                backgroundColor: "rgba(139,92,246,0.15)",
                fill: true,
                tension: 0.4,
            },
            {
                label: "Expenses",
                data: [2500, 2000, 3000, 2800, 3500, 4000, 3700],
                borderColor: "#F43F5E", // وردي ناعم
                backgroundColor: "rgba(244,63,94,0.15)",
                fill: true,
                tension: 0.4,
            },
            {
                label: "Savings",
                data: [1500, 1000, 2000, 1700, 2500, 3000, 2800],
                borderColor: "#6366F1", // أزرق بنفسجي
                backgroundColor: "rgba(99,102,241,0.15)",
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }, // هنصمم الليجند يدويًا
            title: { display: false },
        },
        scales: {
            x: {
                ticks: { color: "#6B7280" },
                grid: { color: "rgba(229,231,235,0.4)" },
            },
            y: {
                ticks: { color: "#6B7280" },
                grid: { color: "rgba(229,231,235,0.4)" },
            },
        },
    };

    const legendItems = [
        { label: "Income", color: "#8B5CF6" },
        { label: "Expenses", color: "#F43F5E" },
        { label: "Savings", color: "#6366F1" },
    ];

    return (
        <div className="box rounded-xl relative w-full h-80 flex flex-col">
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-black/60 backdrop-blur-xs z-40 text-center p-6">
                {/* النص */}
                <p className="text-gray-800 font-medium mb-2">
                    Please enter your income data
                </p>
                <p className="text-white text-sm mb-4">
                    We need your income to show the Money Flow chart.
                </p>

                {/* الزر */}
                <button className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 w-fit text-white rounded-full text-sm font-medium transition">
                    Add now
                </button>
            </div>

            <div className="flex items-center justify-between my-4 mx-6">
                <h2 className="text-gray-900 font-semibold text-md my-1">Money Flow</h2>
                <div className="flex items-center gap-4">
                    {legendItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                            ></span>
                            <span className="text-sm text-gray-700 font-medium">{item.label}</span>

                        </div>
                    ))}
                    <button className="px-3 py-1 border me-[-.5rem] cursor-pointer rounded-full text-sm text-gray-600 hover:bg-gray-100">
                        All accounts
                    </button>
                    <button className="px-3 py-1 border rounded-full text-sm cursor-pointer text-gray-600 hover:bg-gray-100">
                        See all →
                    </button>
                </div>
            </div>

            <div className="flex-1">
                <Line data={data} options={options} style={{ padding: '1rem 1.5rem' }} />
            </div>
        </div>
    );
};

export default MoneyFlowChart;
