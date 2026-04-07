import { useState } from "react";
import { User, Lock, Settings, Upload } from "lucide-react";
import ProfileInfo from "./ProfileInfo";
import Security from "./Security";
import Preferences from "./Preferences";
import BackgroundCanvas from "../../three/canvas/BackgroundCanvas";

const Profile = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const toggleOpen = (index: number) => setActiveIndex(index);

    const buttons = [
        { icon: <User size={17} strokeWidth={1.75} />, label: "Personal Information" },
        { icon: <Lock size={20} strokeWidth={1.75} />, label: "Security" },
        { icon: <Settings size={20} strokeWidth={1.75} />, label: "Preferences" },
    ];

    return (
        <section
            id="Support"
            className="min-h-screen text-gray-900 p-6 relative"
        >
            <div className="absolute inset-0 -z-10">
                <BackgroundCanvas />
            </div>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-semibold mb-8 text-gray-900 drop-shadow">
                    Profile
                </h1>

                <div
                    data-aos="zoom-in"
                    data-aos-duration="500"
                    className="form"
                >
                    {/* Profile Header */}
                    <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                        <div className="relative">
                            <span className="relative flex shrink-0 overflow-hidden rounded-full w-24 h-24 border border-white/40 shadow-md">
                                <span className="flex h-full w-full items-center justify-center rounded-full bg-white/40 text-2xl text-gray-800 backdrop-blur-sm">
                                    I
                                </span>
                            </span>
                            <button className="inline-flex items-center justify-center text-sm font-medium bg-white/50 hover:bg-white/70 absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 border border-white/40 shadow-md transition">
                                <Upload color="#1e3a8a" strokeWidth={1.5} size={18} />
                            </button>
                        </div>

                        <div className="text-center md:text-left">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Islam Ahmed
                            </h2>
                            <p className="text-gray-700">islam@gmail.com</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <nav className="inline-flex h-10 items-center justify-center bg-white/30 rounded-lg p-1 mb-6 border border-white/30 backdrop-blur-md shadow-sm">
                        {buttons.map((btn, index) => (
                            <button
                                key={index}
                                onClick={() => toggleOpen(index)}
                                className={`justify-center px-4 py-2 text-sm font-medium flex items-center gap-2 rounded-md transition-all duration-200 cursor-pointer ${activeIndex === index
                                        ? "bg-primary-600 text-white shadow-md"
                                        : "text-gray-800 hover:text-primary-700 hover:bg-white/60"
                                    }`}
                            >
                                {btn.icon}
                                {btn.label}
                            </button>
                        ))}
                    </nav>

                    {/* Content */}
                    <div className="text-gray-800">
                        {activeIndex === 0 ? (
                            <ProfileInfo />
                        ) : activeIndex === 1 ? (
                            <Security />
                        ) : (
                            <Preferences />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Profile;

