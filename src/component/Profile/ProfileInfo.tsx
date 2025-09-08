import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { CircleUser, Mail, Phone, Calendar, Building2, Save } from "lucide-react";

type FormDataType = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone?: string;
  birth?: string;
  company?: string;
};

type ErrorsType = {
  phone?: string;
  firstName?: string;
  lastName?: string;
};

const ProfileInfo = () => {
  const [formData, setFormData] = useState<FormDataType>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    birth: "",
    company: "",
  });

  const [errors, setErrors] = useState<ErrorsType>({});

  const validate = (): boolean => {
    const newErrors: ErrorsType = {};
    const nameRegex = /^[A-Za-z]+$/;
    const phoneRegex = /^[0-9]+$/;

    if (!nameRegex.test(formData.firstName)) {
      newErrors.firstName = "First name must contain only letters";
    }
    if (!nameRegex.test(formData.lastName)) {
      newErrors.lastName = "Last name must contain only letters";
    }
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Phone number must contain only numbers";
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
    "flex h-10 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <section id="ProfileInfo">
      <form
        className="space-y-4"
        data-aos="zoom-in"
        data-aos-duration="500"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">First Name</label>
            <div className="relative">
              <CircleUser className="absolute top-2.5 left-2 text-gray-400" size={20} />
              <input
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                className={`${inputClass} pl-10`}
                name="firstName"
                placeholder="First Name"
                required
              />
              {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
            </div>
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Last Name</label>
            <div className="relative">
              <input
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                className={inputClass}
                name="lastName"
                placeholder="Last Name"
                required
              />
              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute top-2.5 left-2 text-gray-400" size={20} />
              <input
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`${inputClass} pl-10`}
                name="email"
                placeholder="Email"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Phone</label>
            <div className="relative">
              <Phone className="absolute top-2.5 left-2 text-gray-400" size={20} />
              <input
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className={`${inputClass} pl-10`}
                name="phone"
                placeholder="Phone"
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date of Birth */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Date of Birth</label>
            <div className="relative">
              <Calendar className="absolute top-2.5 left-2 text-gray-400" size={20} />
              <input
                type="date"
                value={formData.birth}
                onChange={handleChange}
                className={`${inputClass} pl-10`}
                name="birth"
              />
            </div>
          </div>

          {/* Company */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Company</label>
            <div className="relative">
              <Building2 className="absolute top-2.5 left-2 text-gray-400" size={20} />
              <input
                type="text"
                value={formData.company}
                onChange={handleChange}
                className={`${inputClass} pl-10`}
                name="company"
                placeholder="Company"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="inline-flex items-center justify-center text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-md h-10 px-4 py-2 transition"
        >
          <Save size={20} className="mr-2" />
          Update Profile
        </button>
      </form>
    </section>
  );
};

export default ProfileInfo;
