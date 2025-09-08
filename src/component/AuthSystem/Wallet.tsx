import { useState } from "react";
import { Link } from "react-router-dom";

const Wallet = () => {
    const [formData, setFormData] = useState({
        phoneNumber: "",
        pinCode: "",
    });

    const [errors, setErrors] = useState<{
        phoneNumber?: string;
        pinCode?: string;
    }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const newErrors: typeof errors = {};
        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = "Phone number is required";
        }
        if (!formData.pinCode.trim()) {
            newErrors.pinCode = "PIN code is required";
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
        alert("Wallet login submitted: " + JSON.stringify(formData, null, 2));
    };

    return (
        <section
            id="Wallet"
            className="h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center text-white"
        >
            <div className="bg-white text-black rounded-2xl shadow-md p-8 w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-semibold">Wallet Login</h2>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {/* Phone Number */}
                    <div className="mb-4">
                        <label htmlFor="phoneNumber" className="block font-medium">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                        {errors.phoneNumber && (
                            <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
                        )}
                    </div>

                    {/* PIN Code */}
                    <div className="mb-4">
                        <label htmlFor="pinCode" className="block font-medium">
                            PIN Code
                        </label>
                        <input
                            type="password"
                            id="pinCode"
                            name="pinCode"
                            value={formData.pinCode}
                            onChange={handleChange}
                            placeholder="Enter your PIN code"
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                        {errors.pinCode && (
                            <p className="text-red-500 text-sm">{errors.pinCode}</p>
                        )}
                    </div>

                    {/* Policy */}
                    <p className="text-gray-500 text-sm mb-3">
                        By submitting your info, you agree to our policy at{" "}
                        <span className="text-sky-600">TheHomeless.org</span>
                    </p>

                    {/* Back to Register/Login */}
                    <p className="text-sm mb-4">
                        Don’t have an Wallet?{" "}
                        <Link to="/register" className="text-sky-600 hover:underline">
                            Sign Up
                        </Link>
                    </p>

                    {/* Button */}
                    <button
                        type="submit"
                        className="w-full bg-sky-800 hover:bg-sky-600 text-white py-2 rounded-md transition-colors"
                    >
                        Access Wallet
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Wallet;
