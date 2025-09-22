import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BackgroundCanvas from "../BackgroundCanvas";

const Login = () => {
  const [formData, setFormData] = useState({ name: "", password: "" });
  const [errors, setErrors] = useState<{ name?: string; password?: string }>({});

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: { name?: string; password?: string } = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
    navigate("/Dashboard");
  };

  return (
    <section
      id="Login"
      className="h-screen flex items-center justify-center relative overflow-hidden "
    >
      {/* Background Canvas */}
      <div className="absolute inset-0 -z-10">
        <BackgroundCanvas />
      </div>

      {/* form */}
      <div
        className="bg-white shadow-[0_0_25px_rgba(56,189,248,0.6)] text-black rounded-2xl p-8 w-full max-w-md relative z-10 backdrop-blur-md bg-opacity-80"
        data-aos="fade-up"
      >
        {/* Header */}
        <div className="text-center mb-6" data-aos="zoom-in">
          <h2 className="text-2xl font-semibold">Sign into your account</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} data-aos="flip-left">
          {/* Name */}
          <div className="mb-4" data-aos="fade-right">
            <label htmlFor="name" className="block font-medium">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          {/* Password */}
          <div className="mb-4" data-aos="fade-left">
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

          {/* Policy */}
          <p className="text-gray-500 text-sm mb-3" data-aos="fade-up">
            By submitting your info, you agree to our policy at{" "}
            <span className="text-sky-600">finexa</span>
          </p>

          {/* Register link */}
          <p className="text-sm mb-4" data-aos="fade-up" data-aos-delay="200">
            Don&apos;t have an account?{" "}
            <Link to="/Register" className="text-sky-600 hover:underline">
              Register
            </Link>
          </p>

          {/* Button */}
          <button
            type="submit"
            data-aos="zoom-in"
            data-aos-delay="400"
            className="w-full bg-sky-800 hover:bg-sky-600 text-white py-2 rounded-md transition-colors cursor-pointer"
          >
            Sign In
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
