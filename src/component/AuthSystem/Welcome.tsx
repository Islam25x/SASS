import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
    const [step, setStep] = useState(1);
    const totalSteps = 4;

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        // Step 1 - Income
        salary: "",
        freelance: "",
        otherIncome: "",

        // Step 2 - Expenses
        utilities: "",
        rent: "",
        shopping: "",
        restaurants: "",
        transport: "",
        health: "",
        entertainment: "",

        // Step 3 - Transactions
        transactions: [] as {
            transactionDate: string;
            transactionAmount: string;
            paymentName: string;
            paymentMethod: string;
            category: string;
        }[],

        // Step 4 - Goals
        savingGoals: [] as {
            goalName: string;
            totalCost: string;
            savedAmount: string;
        }[],
    });

    const [transaction, setTransaction] = useState({
        transactionDate: "",
        transactionAmount: "",
        paymentName: "",
        paymentMethod: "",
        category: "",
    });

    const [goal, setGoal] = useState({
        goalName: "",
        totalCost: "",
        savedAmount: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleTransactionChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setTransaction((prev) => ({ ...prev, [name]: value }));
    };

    const addTransaction = () => {
        if (
            transaction.transactionDate &&
            transaction.transactionAmount &&
            transaction.paymentName &&
            transaction.paymentMethod &&
            transaction.category
        ) {
            setFormData((prev) => ({
                ...prev,
                transactions: [...prev.transactions, transaction],
            }));
            // reset current transaction input fields
            setTransaction({
                transactionDate: "",
                transactionAmount: "",
                paymentName: "",
                paymentMethod: "",
                category: "",
            });
        } else {
            alert("Please fill all transaction fields before adding.");
        }
    };

    const removeTransaction = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            transactions: prev.transactions.filter((_, i) => i !== index),
        }));
    };

    // Add goal
    const addGoal = () => {
        if (goal.goalName && goal.totalCost && goal.savedAmount) {
            setFormData((prev) => ({
                ...prev,
                savingGoals: [...prev.savingGoals, goal],
            }));
            setGoal({
                goalName: "",
                totalCost: "",
                savedAmount: "",
            });
        } else {
            alert("Please fill all saving goal fields before adding.");
        }
    };

    // Remove goal
    const removeGoal = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            savingGoals: prev.savingGoals.filter((_, i) => i !== index),
        }));
    };
    // Handle input change
    const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setGoal((prev) => ({ ...prev, [name]: value }));
    };
    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate("/Dashboard");
    };


    return (
        <section className="h-screen flex items-center bg-gray-50">
            <div className="ms-40 me-45">
                <img
                    src="public\imgs\finexa-finance--next-generation-high-resolution-logo-transparent.png"
                    alt="Welcome"
                    className="mb-8 w-60 h-auto"
                />
            </div>
            <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-3xl">
                {/* PROGRESS BAR */}
                <div className="mb-8">
                    <div className="flex justify-between mb-2 text-sm font-medium text-gray-600">
                        <span>Income</span>
                        <span>Expenses</span>
                        <span>Transactions</span>
                        <span>Goals</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-sky-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(step / totalSteps) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Step Header */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        {step === 1 && "Step 1: Income"}
                        {step === 2 && "Step 2: Expenses"}
                        {step === 3 && "Step 3: Transactions"}
                        {step === 4 && "Step 4: Goals"}
                    </h2>
                </div>

                {/* FORM */}
                <div>
                    {/* STEP 1 - INCOME */}
                    {step === 1 && (
                        <div className="grid gap-4">
                            <div>
                                <label className="block font-medium text-gray-700">
                                    Monthly Salary
                                </label>
                                <input
                                    type="number"
                                    name="salary"
                                    value={formData.salary}
                                    onChange={handleChange}
                                    placeholder="Enter monthly salary"
                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
                                />
                            </div>

                            <div>
                                <label className="block font-medium text-gray-700">
                                    Freelance / Investments / Rent
                                </label>
                                <input
                                    type="number"
                                    name="freelance"
                                    value={formData.freelance}
                                    onChange={handleChange}
                                    placeholder="Enter extra income"
                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
                                />
                            </div>

                            <div>
                                <label className="block font-medium text-gray-700">
                                    Other Income Sources
                                </label>
                                <input
                                    type="number"
                                    name="otherIncome"
                                    value={formData.otherIncome}
                                    onChange={handleChange}
                                    placeholder="Enter other income"
                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
                                />
                            </div>
                        </div>
                    )}

                    {/* STEP 2 - EXPENSES */}
                    {step === 2 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-medium text-gray-700">
                                    Utilities (Electricity, Internet, Mobile)
                                </label>
                                <input
                                    type="number"
                                    name="utilities"
                                    value={formData.utilities}
                                    onChange={handleChange}
                                    placeholder="Enter monthly utilities cost"
                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
                                />
                            </div>

                            <div>
                                <label className="block font-medium text-gray-700">
                                    Rent / Loan
                                </label>
                                <input
                                    type="number"
                                    name="rent"
                                    value={formData.rent}
                                    onChange={handleChange}
                                    placeholder="Enter rent or loan payment"
                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
                                />
                            </div>

                            <div>
                                <label className="block font-medium text-gray-700">
                                    Shopping
                                </label>
                                <input
                                    type="number"
                                    name="shopping"
                                    value={formData.shopping}
                                    onChange={handleChange}
                                    placeholder="Enter shopping expenses"
                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
                                />
                            </div>

                            <div>
                                <label className="block font-medium text-gray-700">
                                    Restaurants & Cafes
                                </label>
                                <input
                                    type="number"
                                    name="restaurants"
                                    value={formData.restaurants}
                                    onChange={handleChange}
                                    placeholder="Enter restaurants and cafes expenses"
                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
                                />
                            </div>

                            <div>
                                <label className="block font-medium text-gray-700">
                                    Transport / Fuel
                                </label>
                                <input
                                    type="number"
                                    name="transport"
                                    value={formData.transport}
                                    onChange={handleChange}
                                    placeholder="Enter transport or fuel costs"
                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
                                />
                            </div>

                            <div>
                                <label className="block font-medium text-gray-700">
                                    Health & Beauty
                                </label>
                                <input
                                    type="number"
                                    name="health"
                                    value={formData.health}
                                    onChange={handleChange}
                                    placeholder="Enter health and beauty expenses"
                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
                                />
                            </div>

                            <div>
                                <label className="block font-medium text-gray-700">
                                    Entertainment / Travel
                                </label>
                                <input
                                    type="number"
                                    name="entertainment"
                                    value={formData.entertainment}
                                    onChange={handleChange}
                                    placeholder="Enter entertainment and travel expenses"
                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
                                />
                            </div>
                        </div>
                    )}

                    {/* STEP 3 - TRANSACTIONS */}
                    {step === 3 && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-medium text-gray-700">
                                        Date & Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        name="transactionDate"
                                        value={transaction.transactionDate}
                                        onChange={handleTransactionChange}
                                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
                                    />
                                </div>

                                <div>
                                    <label className="block font-medium text-gray-700">
                                        Amount
                                    </label>
                                    <input
                                        type="number"
                                        name="transactionAmount"
                                        value={transaction.transactionAmount}
                                        onChange={handleTransactionChange}
                                        placeholder="Enter amount"
                                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
                                    />
                                </div>

                                <div>
                                    <label className="block font-medium text-gray-700">
                                        Payment Name
                                    </label>
                                    <input
                                        type="text"
                                        name="paymentName"
                                        value={transaction.paymentName}
                                        onChange={handleTransactionChange}
                                        placeholder="e.g. YouTube, Reserved, Yaposhka"
                                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
                                    />
                                </div>

                                <div>
                                    <label className="block font-medium text-gray-700">
                                        Payment Method
                                    </label>
                                    <select
                                        name="paymentMethod"
                                        value={transaction.paymentMethod}
                                        onChange={handleTransactionChange}
                                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-sky-500"
                                    >
                                        <option value="">— Select Method —</option>
                                        <option value="VISA">VISA</option>
                                        <option value="Mastercard">Mastercard</option>
                                        <option value="Wallet">Wallet</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block font-medium text-gray-700">
                                        Category
                                    </label>
                                    <select
                                        name="category"
                                        value={transaction.category}
                                        onChange={handleTransactionChange}
                                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-sky-500"
                                    >
                                        <option value="">— Select Category —</option>
                                        <option value="Subscription">Subscription</option>
                                        <option value="Shopping">Shopping</option>
                                        <option value="Restaurants">Restaurants</option>
                                        <option value="Transport">Transport</option>
                                        <option value="Health">Health</option>
                                        <option value="Entertainment">Entertainment</option>
                                    </select>
                                </div>
                            </div>

                            {/* Add Transaction Button */}
                            <button
                                type="button"
                                onClick={addTransaction}
                                className="mt-4 bg-sky-800 hover:bg-sky-600 text-white px-6 py-2 rounded-md"
                            >
                                + Add Transaction
                            </button>

                            {/* Transactions List */}
                            <div className="mt-6">
                                <h3 className="font-semibold text-gray-700 mb-2">
                                    Added Transactions:
                                </h3>
                                {formData.transactions.length === 0 && (
                                    <p className="text-gray-500 text-sm">No transactions added yet.</p>
                                )}
                                <ul className="space-y-2">
                                    {formData.transactions.map((t, index) => (
                                        <li
                                            key={index}
                                            className="flex justify-between items-center bg-gray-100 p-3 rounded-md"
                                        >
                                            <span>
                                                {t.transactionDate} — {t.paymentName} — ${t.transactionAmount} (
                                                {t.paymentMethod}, {t.category})
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => removeTransaction(index)}
                                                className="text-red-600 hover:underline text-sm"
                                            >
                                                Remove
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}

                    {/* STEP 4 - SAVING GOALS */}
                    {step === 4 && (
                        <div className="grid  gap-4">

                            {/* Inputs */}
                            <label className="block font-medium text-gray-700">
                                goal Name
                            </label>
                            <input
                                type="text"
                                name="goalName"
                                value={goal.goalName}
                                onChange={handleGoalChange}
                                placeholder="Goal Name (e.g. Laptop, Car, House)"
                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
                            />
                            <label className="block font-medium text-gray-700">
                                total Cost
                            </label>
                            <input
                                type="number"
                                name="totalCost"
                                value={goal.totalCost}
                                onChange={handleGoalChange}
                                placeholder="Total Cost"
                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
                            />
                            <label className="block font-medium text-gray-700">
                                saved Amount
                            </label>
                            <input
                                type="number"
                                name="savedAmount"
                                value={goal.savedAmount}
                                onChange={handleGoalChange}
                                placeholder="Saved Amount"
                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
                            />

                            {/* Add Goal Button */}
                            <button
                                type="button"
                                onClick={addGoal}
                                className="mt-4 bg-sky-800 hover:bg-sky-600 text-white px-6 py-2 rounded-md"
                            >
                                + Add Goal
                            </button>

                            {/* Goals List */}
                            <div className="mt-6">
                                {formData.savingGoals.map((g, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between items-center bg-gray-100 p-3 rounded-md mb-2"
                                    >
                                        <span>
                                            {g.goalName} — Total: ${g.totalCost} — Saved: ${g.savedAmount}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removeGoal(index)}
                                            className="text-red-600 hover:underline text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>

                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-6">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="bg-gray-300 hover:bg-gray-400 text-black px-6 py-2 rounded-md"
                            >
                                ← Back
                            </button>
                        )}
                        {step < totalSteps ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="ml-auto bg-sky-800 hover:bg-sky-600 text-white px-6 py-2 rounded-md"
                            >
                                Next →
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="ml-auto bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-md"
                                onClick={handleSubmit}
                            >
                                Submit ✔
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Welcome;