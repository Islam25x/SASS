import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import BackgroundCanvas from "../BackgroundCanvas";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [errors, setErrors] = useState<{
    fullName?: string;
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    agree?: string;
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
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.agree) newErrors.agree = "You must agree to the policy";
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    // Navigate or API call can be added here
    navigate("/");
  };

  return (
    <section
      id="Register"
      className="h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Background Canvas */}
      <div className="absolute inset-0 -z-10">
        <BackgroundCanvas />
      </div>

      {/* Registration Form */}
      <div
        className="bg-white text-black rounded-2xl shadow-[0_0_25px_rgba(56,189,248,0.6)] p-8 w-full max-w-2xl relative z-10 backdrop-blur-lg bg-opacity-90"
        data-aos="fade-up"
      >
        {/* Header */}
        <div className="text-center mb-6" data-aos="zoom-in">
          <h2 className="text-3xl font-bold text-sky-700 drop-shadow-md">
            Create an Account
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6" data-aos="flip-left">
          {/* Username & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div data-aos="fade-right">
              <label htmlFor="username" className="block font-medium">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
              />
              {errors.username && (
                <p className="text-red-500 text-sm">{errors.username}</p>
              )}
            </div>

            <div data-aos="fade-left">
              <label htmlFor="email" className="block font-medium">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div data-aos="fade-right">
              <label htmlFor="password" className="block font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            <div data-aos="fade-left">
              <label htmlFor="confirmPassword" className="block font-medium">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Policy Checkbox */}
          <div className="flex items-center gap-2" data-aos="fade-up">
            <input
              type="checkbox"
              id="agree"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
              className="h-4 w-4 text-sky-600 border-gray-300 rounded"
            />
            <label htmlFor="agree" className="text-sm text-gray-700">
              I agree to the <span className="text-sky-600 font-semibold">finexa policy</span>
            </label>
          </div>
          {errors.agree && <p className="text-red-500 text-sm">{errors.agree}</p>}

          {/* Login link */}
          <p
            className="text-sm"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Already have an account? {" "}
            <Link to="/" className="text-sky-600 hover:underline">
              Login
            </Link>
          </p>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-sky-700 hover:bg-sky-600 text-white py-2 rounded-md transition-all cursor-pointer"
          >
            Register
          </button>
        </form>
      </div>
    </section>
  );
};

export default Register;
