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
        "flex h-10 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10";

    return (
        <section id="Security">
            <form
                className="space-y-4"
                data-aos="zoom-in"
                data-aos-duration="500"
                onSubmit={handleSubmit}
            >
                {/* Password */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <div className="relative">
                        <Lock className="absolute top-2.5 left-2 text-gray-500" size={20} />
                        <input
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={inputClass}
                            name="password"
                            placeholder="Password"
                            required
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm">{errors.password}</p>
                        )}
                    </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">New Password</label>
                    <div className="relative">
                        <Lock className="absolute top-2.5 left-2 text-gray-500" size={20} />
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
                            <p className="text-red-500 text-sm">{errors.newPassword}</p>
                        )}
                    </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Confirm Password</label>
                    <div className="relative">
                        <Lock className="absolute top-2.5 left-2 text-gray-500" size={20} />
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
                            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row gap-4 my-4">
                    <button
                        type="submit"
                        className="relative inline-flex items-center justify-center bg-blue-600 text-white text-sm font-medium rounded-md transition hover:bg-blue-700 h-10 px-9 py-2"
                    >
                        <Lock className="absolute left-2" size={18} />
                        Change Password
                    </button>

                    <button
                        type="button"
                        className="relative inline-flex items-center justify-center bg-red-600 text-white text-sm font-medium rounded-md transition hover:bg-red-700 h-10 px-9 py-2"
                    >
                        <Trash2 className="absolute left-2" size={20} />
                        Delete Account
                    </button>
                </div>
            </form>
        </section>
    );
};

export default Security;
