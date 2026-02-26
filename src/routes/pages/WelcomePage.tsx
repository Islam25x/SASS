import { Bot, Send, CreditCard, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import PaymentMethod from "./PaymentMethod";
import RobotCanvas from "../../three/canvas/RobotCanvas";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

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
        <section className="h-screen bg-gradient-to-br from-gray-50 to-indigo-100 flex flex-col lg:flex-row p-6 !overflow-hidden">
            {/* Left side: text and features */}
            <div className="flex-1 flex flex-col justify-center items-center lg:items-start text-center lg:text-left lg:order-1 order-2 space-y-8">
                {/* العنوان */}
                <div data-aos="fade-down">
                    <h1 className="text-4xl lg:text-5xl font-bold text-indigo-700 mb-4">
                        Welcome to finexa
                    </h1>
                    <p className="text-lg text-gray-600 max-w-xl">
                        Discover the full power of managing your money with our smart and secure solutions.
                    </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl w-full">
                    {features.map((f, i) => (
                        <div
                            key={i}
                            className="shadow-lg rounded-2xl hover:shadow-xl hover:scale-[1.03] transition duration-300 ease-in-out bg-white p-6 flex flex-col items-center text-center"
                            data-aos="zoom-in"
                            data-aos-once="true"
                            data-aos-delay={i * 200}
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
                <button
                    onClick={openModal}
                    className="px-8 py-4 text-lg rounded-2xl bg-indigo-600 transition-all duration-300 ease-in-out text-white hover:bg-indigo-700 cursor-pointer"
                    data-aos="fade-right"
                    data-aos-anchor-placement="top-bottom"
                    data-aos-offset="0"
                >
                    Add payment method
                </button>
            </div>

            {/* Right Side: robot + animation */}
            <div className="flex-1 lg:h-screen h-96 flex items-center justify-center relative lg:order-2 order-1 overflow-hidden">
                {/* ✨ الخلفية المتحركة (لوتي) */}
                <div className="absolute inset-0 flex items-center justify-center z-1 opacity-70">
                    <DotLottieReact
                        src="https://lottie.host/b4e921e8-412b-4cc3-9e60-a3ca2cf2db8c/pI7zSbyVRI.lottie"
                        loop
                        autoplay
                        className="w-[800px] h-[800px] scale-106"
                    />
                </div>

                {/* 🤖 الروبوت */}
                <div className="w-full h-full relative z-10">
                    <RobotCanvas />
                </div>
            </div>

            {/* Modal */}
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
