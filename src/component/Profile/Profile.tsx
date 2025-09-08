import { useState } from "react";
import { User, Lock, Settings, Upload } from "lucide-react";
import ProfileInfo from "./ProfileInfo";
import Security from "./Security";
import Preferences from "./Preferences";

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
            className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900 p-6"
        >
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Profile</h1>
                <div
                    data-aos="zoom-in"
                    data-aos-duration="500"
                    className="bg-white border border-gray-200 p-6 rounded-lg shadow"
                >
                    {/* Profile Header */}
                    <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                        <div className="relative">
                            <span className="relative flex shrink-0 overflow-hidden rounded-full w-24 h-24 border border-gray-300">
                                <span className="flex h-full w-full items-center justify-center rounded-full bg-gray-200 text-2xl text-gray-600">
                                    I
                                </span>
                            </span>
                            <button className="inline-flex items-center justify-center text-sm font-medium bg-gray-100 hover:bg-gray-200 absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 border border-gray-300 shadow-sm">
                                <Upload color="black" strokeWidth={1.5} size={18} />
                            </button>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold"> </h2>
                            <p className="text-gray-600">islam@gmail.com</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <nav className="inline-flex h-10 items-center justify-center bg-gray-100 rounded-md p-1 mb-6 border border-gray-200">
                        {buttons.map((btn, index) => (
                            <button
                                key={index}
                                onClick={() => toggleOpen(index)}
                                className={`justify-center no-underline px-3 py-1.5 text-sm font-medium flex items-center gap-2 rounded-md transition-colors ${activeIndex === index
                                        ? "bg-blue-600 text-white shadow"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                                    }`}
                            >
                                {btn.icon}
                                {btn.label}
                            </button>
                        ))}
                    </nav>

                    {/* Content */}
                    {activeIndex === 0 ? (
                        <ProfileInfo />
                    ) : activeIndex === 1 ? (
                        <Security />
                    ) : (
                        <Preferences />
                    )}
                </div>
            </div>
        </section>
    );
};

export default Profile;
