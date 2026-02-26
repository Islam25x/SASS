import { useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { CircleUser, Mail, Phone, Calendar, Save } from "lucide-react";

type FormDataType = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone?: string;
  birth?: string;
};

type ErrorsType = Partial<Record<keyof FormDataType, string>>;

type FieldType = {
  id: keyof FormDataType;
  label: string;
  type: string;
  icon?: ReactNode;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  value?: string;
};

const ProfileInfo = () => {
  const [formData, setFormData] = useState<FormDataType>({
    firstName: "",
    lastName: "",
    username: "Islam Ahmed",
    email: "",
    phone: "",
    birth: "",
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      console.log("✅ Form submitted successfully", formData);
    }
  };

  const inputClass =
    "flex h-10 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500";

  // 🧩 تعريف الحقول كمصفوفة ثنائية
  const fields: FieldType[][] = [
    [
      {
        id: "firstName",
        label: "First Name",
        type: "text",
        icon: <CircleUser size={20} />,
        placeholder: "First Name",
        required: true,
      },
      {
        id: "lastName",
        label: "Last Name",
        type: "text",
        placeholder: "Last Name",
        required: true,
      },
    ],
    [
      {
        id: "username",
        label: "Username",
        type: "text",
        icon: <CircleUser size={20} />,
        disabled: true,
        value: "Islam Ahmed",
      },
      {
        id: "email",
        label: "Email",
        type: "email",
        icon: <Mail size={20} />,
        placeholder: "Email",
        required: true,
      },
    ],
    [
      {
        id: "birth",
        label: "Date of Birth",
        type: "date",
        icon: <Calendar size={20} />,
      },
      {
        id: "phone",
        label: "Phone",
        type: "tel",
        icon: <Phone size={20} />,
        placeholder: "Phone",
      },
    ],
  ];

  return (
    <section id="ProfileInfo">
      <form
        className="space-y-4"
        data-aos="zoom-in"
        data-aos-duration="500"
        onSubmit={handleSubmit}
      >
        {fields.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {row.map((field) => (
              <div key={field.id} className="space-y-2">
                <label className="text-sm font-medium">{field.label}</label>
                <div className="relative">
                  {field.icon && (
                    <span className="absolute top-2.5 left-2 text-gray-400">
                      {field.icon}
                    </span>
                  )}
                  <input
                    type={field.type}
                    name={field.id}
                    value={field.disabled ? field.value ?? "" : formData[field.id] ?? ""}
                    onChange={field.disabled ? undefined : handleChange}
                    placeholder={field.placeholder}
                    required={field.required}
                    disabled={field.disabled}
                    className={`${inputClass} ${field.icon ? "pl-10" : ""} ${
                      field.disabled ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  />
                  {errors[field.id] && (
                    <p className="text-red-500 text-sm">{errors[field.id]}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}

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
