import { useState } from "react"
import PaymentMethodForm from "./PaymentMethodForm"
type Field = {
    id: string;
    label: string;
    type: string;
    placeholder?: string;
    maxLength?: number;
};

function PaymentMethod() {
    const [paymentMethod, setPaymentMethod] = useState<string>("card")

    // Credit Card Fields
    const cardFields: Field[][] = [
        [
            { id: "cardholder-name", label: "Cardholder Name", type: "text", placeholder: "John Doe" },
            { id: "expiry", label: "Expiry Date", type: "text", placeholder: "MM/YY", maxLength: 5 },
        ],
        [
            { id: "card-number", label: "Card Number", type: "text", placeholder: "1234 5678 9012 3456", maxLength: 19 },
        ],
    ];
    const walletFields: Field[][] = [
        [
            { id: "wallet-id", label: "Wallet ID / Phone Number", type: "text", placeholder: "+201234567890" },
        ],
        [

        ],
    ];

    return (
        <section className="max-w-lg mx-auto mt-10 bg-white shadow-lg p-8 rounded-2xl">
            <form className="space-y-6">
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
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400"
                    >
                        <option value="card">💳 Credit/Debit Card</option>
                        <option value="cash">💵 Cash</option>
                        <option value="wallet">👛 Wallet</option>
                    </select>
                </div>
                {paymentMethod === "card" && <PaymentMethodForm fields={cardFields} />}
                {paymentMethod === "wallet" && <PaymentMethodForm fields={walletFields} />}
                <button
                    type="submit"
                    className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-white font-medium shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                    Save Method
                </button>
            </form>

            <div className="mt-6 text-center text-gray-600">
                <p>
                    Selected Method:{" "}
                    <span className="font-semibold text-indigo-600">
                        {paymentMethod}
                    </span>
                </p>
            </div>
        </section>
    )
}

export default PaymentMethod
