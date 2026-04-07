import { useState } from "react";
import type { Field } from "../../types/Fields";

interface PaymentMethodFormProps {
    fields: Field[][];
    paymentMethod: "card" | "wallet" | "cash";
}

function PaymentMethodForm({ fields, paymentMethod }: PaymentMethodFormProps) {
    const [showVerifyField, setShowVerifyField] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    const handleVerify = () => {
        setShowVerifyField(true);
    };

    const handleConfirmVerification = () => {
        setShowVerifyField(false);
        setIsVerified(true);
    };

    return (
        <div className="space-y-4">
            {fields.map((row, rowIndex) => (
                <div
                    key={rowIndex}
                    className={paymentMethod !== "card" ? `w-110` : `flex gap-4`}
                >
                    {row.map((field) => (
                        <div
                            key={field.id}
                            className={paymentMethod !== "card" ? `` : `flex-1`}
                        >
                            {/* الحقول العادية */}
                            {field.label && (
                                <>
                                    <label
                                        htmlFor={field.id}
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        {field.label}
                                    </label>

                                    <input
                                        id={field.id}
                                        type={field.type}
                                        placeholder={field.placeholder}
                                        maxLength={field.maxLength}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-600 focus:ring-2 focus:ring-primary/40"
                                    />
                                </>
                            )}

                            {/* زر verify */}
                            {field.id === "wallet-id" && !showVerifyField && !isVerified && (
                                <button
                                    type="button"
                                    onClick={handleVerify}
                                    className="text-xs text-primary-600 mt-1 text-end w-full hover:underline cursor-pointer"
                                >
                                    verify
                                </button>
                            )}

                            {/* حقل التحقق من الكود */}
                            {field.id === "wallet-id" && showVerifyField && !isVerified && (
                                <div className="mt-2">
                                    <label
                                        htmlFor="verify-id"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        verification code
                                    </label>
                                    <input
                                        id="verify-id"
                                        type="text"
                                        placeholder="Enter verification code"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-600 focus:ring-2 focus:ring-primary/40"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleConfirmVerification}
                                        className="text-xs text-green-600 mt-1 text-end w-full hover:underline cursor-pointer"
                                    >
                                        confirm
                                    </button>
                                </div>
                            )}

                            {/* بعد التحقق → يظهر حقل Wallet Amount */}
                            {field.id === "wallet-id" && isVerified && (
                                <div className="mt-2">
                                    <label
                                        htmlFor="wallet-amount"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Wallet Amount
                                    </label>
                                    <input
                                        id="wallet-amount"
                                        type="number"
                                        placeholder="Enter amount"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-600 focus:ring-2 focus:ring-primary/40"
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default PaymentMethodForm;

