import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Card = () => {
    const [formData, setFormData] = useState({
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        cardAmount: "",
    });
    const navigate = useNavigate();

    const [errors, setErrors] = useState<{
        cardNumber?: string;
        expiryDate?: string;
        cvv?: string;
        cardAmount?: string;
    }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const newErrors: typeof errors = {};
        if (!formData.cardNumber.trim()) {
            newErrors.cardNumber = "Card number is required";
        }
        if (!formData.expiryDate.trim()) {
            newErrors.expiryDate = "Expiry date is required";
        }
        if (!formData.cvv.trim()) {
            newErrors.cvv = "CVV is required";
        }
        if (!formData.cardAmount.trim()) {
            newErrors.cardAmount = "Please enter your wallet amount";
        }
        return newErrors;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        navigate('/Welcome');
    };

    return (
        <section
            id="Card"
            className="h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center text-white"
        >
            <div className="bg-white text-black rounded-2xl shadow-md p-8 w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-semibold">Card Access</h2>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {/* Card Number */}
                    <div className="mb-4">
                        <label htmlFor="cardName" className="block font-medium">
                            Card Name
                        </label>
                        <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            placeholder="Enter your card name"
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                        {errors.cardNumber && (
                            <p className="text-red-500 text-sm">{errors.cardNumber}</p>
                        )}
                    </div>

                    {/* Expiry Date */}
                    <div className="mb-4">
                        <label htmlFor="expiryDate" className="block font-medium">
                            Expiry Date
                        </label>
                        <input
                            type="text"
                            id="expiryDate"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            placeholder="MM/YY"
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                        {errors.expiryDate && (
                            <p className="text-red-500 text-sm">{errors.expiryDate}</p>
                        )}
                    </div>

                    {/* CVV */}
                    <div className="mb-4">
                        <label htmlFor="cvv" className="block font-medium">
                            CVV
                        </label>
                        <input
                            type="password"
                            id="cvv"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleChange}
                            placeholder="Enter CVV"
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                        {errors.cvv && (
                            <p className="text-red-500 text-sm">{errors.cvv}</p>
                        )}
                    </div>
                    {/* Card Amount */}
                    <div className="mb-4">
                        <label htmlFor="CardAmount" className="block font-medium">
                            Card Amount
                        </label>
                        <input
                            type="number"
                            id="CardAmount"
                            name="CardAmount"
                            value={formData.cardAmount}
                            onChange={handleChange}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                        {errors.cardAmount && (
                            <p className="text-red-500 text-sm">{errors.cardAmount}</p>
                        )}
                    </div>

                    {/* Policy */}
                    <p className="text-gray-500 text-sm mb-3">
                        By submitting your info, you agree to our policy at{" "}
                        <span className="text-sky-600">TheHomeless.org</span>
                    </p>

                    {/* Back to Register/Login */}
                    <p className="text-sm mb-4">
                        Don’t have an Card?{" "}
                        <Link to="/register" className="text-sky-600 hover:underline">
                            Sign Up
                        </Link>
                    </p>

                    {/* Button */}
                    <button
                        type="submit"
                        className="w-full bg-sky-800 hover:bg-sky-600 text-white py-2 rounded-md transition-colors"
                    >
                        Access Card
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Card;
