import { Bot, Send, CreditCard, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import PaymentMethod from "./PaymentMethod/PaymentMethod";

export default function Welcome() {
    const [showModal, setShowModal] = useState(false);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const features = [
        {
            icon: <Bot className="w-10 h-10 text-indigo-600" />,
            title: "AI Agent",
            desc: "A smart advisor that helps you make better financial decisions using AI.",
        },
        {
            icon: <Send className="w-10 h-10 text-indigo-600" />,
            title: "Transfer Money",
            desc: "Send money quickly and securely anywhere in the world.",
        },
        {
            icon: <CreditCard className="w-10 h-10 text-indigo-600" />,
            title: "Flexible Payments",
            desc: "Manage your money with a digital wallet, cash, or Visa cards all in one place.",
        },
        {
            icon: <LayoutDashboard className="w-10 h-10 text-indigo-600" />,
            title: "Dashboard",
            desc: "A clear and intuitive dashboard to track and manage all your finances.",
        },
    ];

    return (
        <section className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 flex lg:flex-row flex-col items-center justify-center p-6">
            {/* موبايل تايتل */}
            <div className="lg:hidden block mb-8 text-center" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-indigo-700 mb-4">
                    Welcome to finexa
                </h1>
                <p className="text-base text-gray-600 max-w-md mx-auto">
                    Discover the full power of managing your money with our smart and secure solutions.
                </p>
            </div>

            {/* Left side: text and features */}
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left lg:order-1 order-2">
                {/* تايتل للشاشات الكبيرة */}
                <div className="hidden lg:block mb-8" data-aos="fade-down">
                    <h1 className="text-4xl font-bold text-indigo-700 mb-4">
                        Welcome to finexa
                    </h1>
                    <p className="text-lg text-gray-600 max-w-xl">
                        Discover the full power of managing your money with our smart and secure solutions.
                    </p>
                </div>

                {/* Features grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl w-full">
                    {features.map((f, i) => (
                        <div
                            key={i}
                            className="shadow-lg rounded-2xl hover:shadow-xl transition bg-white p-6 flex flex-col items-center text-center"
                            data-aos="zoom-in"
                            data-aos-delay={i * 100}
                        >
                            {f.icon}
                            <h3 className="mt-4 text-xl font-semibold text-gray-800">
                                {f.title}
                            </h3>
                            <p className="text-gray-500 mt-2 text-sm">{f.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Button */}
                <div className="mt-10" data-aos="fade-up">
                    <button
                        onClick={openModal}
                        className="px-8 py-4 text-lg rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
                    >
                        Add payment method
                    </button>
                </div>
            </div>

            {/* Right side: animation */}
            <div
                className="flex-1 md:mt-8 md:ml-10 flex items-center justify-center lg:order-2 order-1 w-full mb-6 lg:mb-0"
                data-aos="zoom-in"
            >
                <div className="w-full h-80 md:h-96 bg-white rounded-2xl shadow-inner flex items-center justify-center">
                    <DotLottieReact
                        src="https://lottie.host/ed1437d8-2d26-4e6e-b99e-3e8b1cb42cc6/sZK2wCcPF7.lottie"
                        loop
                        autoplay
                    />
                </div>
            </div>

            {/* modal */}
            {showModal && (
                <div
                    onClick={closeModal}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        data-aos="fade-up"
                        data-aos-duration="400"
                    >
                        <PaymentMethod />
                    </div>
                </div>
            )}
        </section>
    );
}
