type Field = {
    id: string;
    label: string;
    type: string;
    placeholder?: string;
    maxLength?: number;
};

interface PaymentMethodFormProps {
    fields: Field[][];
}

function PaymentMethodForm({ fields }: PaymentMethodFormProps) {

    return (
        <div className="space-y-4">
            {fields.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-4">
                    {row.map((field) => (
                        <div key={field.id} className="flex-1">
                            <label htmlFor={field.id} className="label">
                                {field.label}
                            </label>
                            <input
                                id={field.id}
                                type={field.type}
                                placeholder={field.placeholder}
                                maxLength={field.maxLength}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>
                    ))}
                </div>
            ))}
        </div>

    );
}

export default PaymentMethodForm;
