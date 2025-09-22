import { Bot, Send, CreditCard, LayoutDashboard } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function WelcomePage() {
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
        <section className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 flex flex-col md:flex-row items-center justify-center p-6">
            <div className="lg:hidden block" data-aos="fade-down">
                <h1 className="text-4xl font-bold text-indigo-700 mb-4">
                    Welcome to finexa
                </h1>
                <p className="text-lg text-gray-600 mb-10 max-w-xl">
                    Discover the full power of managing your money with our smart and secure solutions.
                </p>
            </div>

            {/* Left side: text and features */}
            <div
                className="flex-1 flex flex-col items-center md:items-start text-center md:text-left lg:order-1 order-2"
                data-aos="fade-right"
            >
                <div className="hidden lg:block">
                    <h1 className="text-4xl font-bold text-indigo-700 mb-4">
                        Welcome to finexa
                    </h1>
                    <p className="text-lg text-gray-600 mb-10 max-w-xl">
                        Discover the full power of managing your money with our smart and secure solutions.
                    </p>
                </div>

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

                <div className="mt-10">
                    <button className="px-8 py-4 text-lg rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer">
                        Add payment method
                    </button>
                </div>
            </div>

            {/* Right side: animation */}
            <div
                className="flex-1 md:mt-0 md:ml-10 flex items-center justify-center lg:order-2 order-1 w-full mb-4 lg:mt-15 mt-[-1rem]"
                data-aos="fade-left"
            >
                <div className="w-full h-96 bg-white rounded-2xl shadow-inner flex items-center justify-center">
                    <DotLottieReact
                        src="https://lottie.host/ed1437d8-2d26-4e6e-b99e-3e8b1cb42cc6/sZK2wCcPF7.lottie"
                        loop
                        autoplay
                    />
                </div>
            </div>
        </section>
    );
}
