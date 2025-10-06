import { FaYoutube } from "react-icons/fa";
import { FaShoppingBag } from "react-icons/fa";
import { FaUtensils } from "react-icons/fa";

const RecentTransactions = () => {
    const transactions = [
        {
            date: "25 Jul 12:30",
            amount: "- $10",
            name: "YouTube",
            icon: <FaYoutube className="text-red-500 text-xl" />,
            method: "VISA **3254",
            category: "Subscription",
        },
        {
            date: "26 Jul 15:00",
            amount: "- $150",
            name: "Reserved",
            icon: <FaShoppingBag className="text-gray-600 text-xl" />,
            method: "Mastercard **2154",
            category: "Shopping",
        },
        {
            date: "27 Jul 9:00",
            amount: "- $80",
            name: "Yaposhka",
            icon: <FaUtensils className="text-pink-500 text-xl" />,
            method: "Mastercard **2154",
            category: "Cafe & Restaurants",
        },
    ];

    return (
        <div className=" rounded-xl box p-6 !w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Recent transactions</h2>
                <div className="flex gap-2">
                    <button className="px-3 py-1 border rounded-full text-sm text-gray-600 hover:bg-gray-100">
                        All accounts
                    </button>
                    <button className="px-3 py-1 border rounded-full text-sm text-gray-600 hover:bg-gray-100">
                        See all →
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="text-gray-500">
                            <th className="py-2">DATE</th>
                            <th className="py-2">AMOUNT</th>
                            <th className="py-2">PAYMENT NAME</th>
                            <th className="py-2">METHOD</th>
                            <th className="py-2">CATEGORY</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((t, i) => (
                            <tr key={i} className="border-t">
                                <td className="py-3">{t.date}</td>
                                <td className="py-3 font-medium text-red-500">{t.amount}</td>
                                <td className="py-3 flex items-center gap-2">
                                    {t.icon}
                                    {t.name}
                                </td>
                                <td className="py-3 text-gray-600">{t.method}</td>
                                <td className="py-3 text-gray-600">{t.category}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentTransactions;
