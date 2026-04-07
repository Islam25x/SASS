import { useState } from "react"
import { useNavigate } from "react-router-dom" // ✅ استيراد useNavigate
import PaymentMethodForm from "./PaymentMethodForm"
import type { Field } from "../../types/Fields";

function PaymentMethod() {
    const [paymentMethod, setPaymentMethod] = useState<string>("card")
    const navigate = useNavigate(); // ✅ إنشاء المتغير الخاص بالتنقل

    // Credit Card Fields
    const cardFields: Field[][] = [
        [
            { id: "cardholder-name", label: "Cardholder Name", type: "text", placeholder: "Islam Salah" },
            { id: "expiry", label: "Expiry Date", type: "text", placeholder: "MM/YY", maxLength: 5 },
        ],
        [
            { id: "card-number", label: "Card Number", type: "text", placeholder: "1234 5678 9012 3456", maxLength: 19 },
        ],
    ];

    const walletFields: Field[][] = [
        [
            { id: "wallet-id", label: "Wallet ID / Phone Number", type: "text", placeholder: "+201234567890" },
            { id: 'verify-id', text: 'verify' }
        ],
    ];

    const CashFields: Field[][] = [
        [
            { id: "Cash-id", label: "Cash Amount", type: "text", placeholder: "please enter Cash Amount" },
        ],
    ];

    // ✅ لما المستخدم يضغط على الزر
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // هنا ممكن تضيف validation أو حفظ البيانات
        navigate("/dashboard"); // ✅ التوجيه إلى صفحة الـ Dashboard
    };

    return (
        <section className="max-w-lg mx-auto mt-10 bg-white shadow-lg p-8 rounded-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                    Add Payment Method
                </h2>

                <div>
                    <label
                        htmlFor="payment-method"
                        className="block mb-2 text-sm font-medium text-gray-700"
                    >
                        Choose a method:
                    </label>
                    <select
                        id="payment-method"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm focus:border-primary-600 focus:ring-2 focus:ring-primary/40"
                    >
                        <option value="card">💳 Credit/Debit Card</option>
                        <option value="cash">💵 Cash</option>
                        <option value="wallet">👛 Wallet</option>
                    </select>
                </div>

                {paymentMethod === "card" && <PaymentMethodForm paymentMethod={paymentMethod} fields={cardFields} />}
                {paymentMethod === "wallet" && <PaymentMethodForm paymentMethod={paymentMethod} fields={walletFields} />}
                {paymentMethod === "cash" && <PaymentMethodForm paymentMethod={paymentMethod} fields={CashFields} />}

                <button
                    type="submit"
                    className="w-full rounded-lg bg-primary-600 px-4 py-2 text-white font-medium shadow hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                >
                    Save Method
                </button>
            </form>

            <div className="mt-6 text-center text-gray-600">
                <p>
                    Selected Method:{" "}
                    <span className="font-semibold text-primary-600">
                        {paymentMethod}
                    </span>
                </p>
            </div>
        </section>
    )
}

export default PaymentMethod

