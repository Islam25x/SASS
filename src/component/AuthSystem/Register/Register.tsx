import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
    isProfessional: false,
    walletAmount: "",
    cardNumber: "",
  });

  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    role?: string;
    walletAmount?: string;
    cardNumber?: string;
  }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    if (!formData.role.trim()) newErrors.role = "Payment method is required";

    if (formData.role === "Wallet" && !formData.walletAmount.trim()) {
      newErrors.walletAmount = "Please enter your wallet amount";
    }

    if (formData.role === "Card" && !formData.cardNumber.trim()) {
      newErrors.cardNumber = "Please enter your card number";
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // ❌ مايتنقلش لصفحة تانية
    }

    // ✅ التنقل حسب الدور
    if (formData.role === "Wallet") {
      navigate("/Wallet");
    } else if (formData.role === "Card") {
      navigate("/Card");
    }
  };

  return (
    <section
      id="SignUp"
      className="h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center text-white"
    >
      <div className="bg-white text-black rounded-2xl shadow-md p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold">Create an Account</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-4">
            <label htmlFor="username" className="block font-medium">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block font-medium">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="password" className="block font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          {/* Role Select */}
          <div className="mb-4">
            <label htmlFor="role" className="block font-medium">
              Select Payment Method
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">— Select Payment Method —</option>
              <option value="Wallet">Wallet</option>
              <option value="Card">Card</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm">{errors.role}</p>
            )}
          </div>

          {/* Wallet Amount */}
          {formData.role === "Wallet" && (
            <div className="mb-4">
              <label htmlFor="walletAmount" className="block font-medium">
                Enter Wallet Amount
              </label>
              <input
                type="number"
                id="walletAmount"
                name="walletAmount"
                value={formData.walletAmount}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              {errors.walletAmount && (
                <p className="text-red-500 text-sm">{errors.walletAmount}</p>
              )}
            </div>
          )}

          {/* Card Number */}
          {formData.role === "Card" && (
            <div className="mb-4">
              <label htmlFor="cardNumber" className="block font-medium">
                Enter Card Number
              </label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              {errors.cardNumber && (
                <p className="text-red-500 text-sm">{errors.cardNumber}</p>
              )}
            </div>
          )}

          {/* Professional checkbox */}
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="isProfessional"
              name="isProfessional"
              checked={formData.isProfessional}
              onChange={handleChange}
              className="h-4 w-4 border-gray-300 rounded"
            />
            <label htmlFor="isProfessional" className="ml-2 text-sm">
              I am an industry professional
            </label>
          </div>

          {/* Policy */}
          <p className="text-gray-500 text-sm mb-3">
            By submitting your info, you agree to our policy at{" "}
            <span className="text-sky-600">TheHomeless.org</span>
          </p>

          {/* Login link */}
          <p className="text-sm mb-4">
            Already have an account?{" "}
            <Link to="/" className="text-sky-600 hover:underline">
              Login
            </Link>
          </p>

          {/* Button */}
          <button
            type="submit"
            className="w-full block text-center bg-sky-800 hover:bg-sky-600 text-white py-2 rounded-md transition-colors cursor-pointer"
          >
            Sign Up
          </button>
        </form>
      </div>
    </section>
  );
};

export default Register;
