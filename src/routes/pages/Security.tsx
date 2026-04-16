import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Lock, Trash2 } from "lucide-react";

type FormDataType = {
  password: string;
  newPassword: string;
  confirmPassword: string;
};

type ErrorsType = {
  password?: string;
  newPassword?: string;
  confirmPassword?: string;
};

const Security = () => {
  const [formData, setFormData] = useState<FormDataType>({
    password: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<ErrorsType>({});

  const validate = (): boolean => {
    const newErrors: ErrorsType = {};
    if (formData.password.length <= 6) {
      newErrors.password = "Password must be longer than 6 characters";
    }
    if (formData.newPassword === formData.password) {
      newErrors.newPassword = "Enter a different password";
    }
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form submitted successfully", formData);
    }
  };

  const inputClass =
    "flex h-9 w-full rounded-2xl border border-slate-200 bg-slate-50/90 px-3.5 py-2 pl-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200";

  return (
    <section id="Security">
      <div className="mb-3 flex flex-col gap-1">
        <h3 className="text-xl font-semibold text-slate-900">Credential controls</h3>
        <p className="text-sm leading-5 text-slate-500">
          Manage password hygiene and keep your financial account protected.
        </p>
      </div>

      <form className="space-y-3" data-aos="zoom-in" data-aos-duration="500" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-2.5 text-slate-400" size={18} />
            <input
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={inputClass}
              name="password"
              placeholder="Password"
              required
            />
            {errors.password && <p className="mt-1.5 text-sm text-red-500">{errors.password}</p>}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">New Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-2.5 text-slate-400" size={18} />
            <input
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              className={inputClass}
              name="newPassword"
              placeholder="New Password"
              required
            />
            {errors.newPassword && (
              <p className="mt-1.5 text-sm text-red-500">{errors.newPassword}</p>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-2.5 text-slate-400" size={18} />
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={inputClass}
              name="confirmPassword"
              placeholder="Confirm Password"
              required
            />
            {errors.confirmPassword && (
              <p className="mt-1.5 text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-1.5 md:flex-row">
          <button
            type="submit"
            className="inline-flex h-9 items-center justify-center rounded-2xl bg-gradient-to-r from-sky-400 to-primary px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(14,165,233,0.24)] transition hover:from-sky-500 hover:to-sky-700"
          >
            <Lock className="mr-2" size={18} />
            Change Password
          </button>

          <button
            type="button"
            className="inline-flex h-9 items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
          >
            <Trash2 className="mr-2" size={18} />
            Delete Account
          </button>
        </div>
      </form>
    </section>
  );
};

export default Security;
