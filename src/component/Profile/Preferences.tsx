import { Save } from "lucide-react";
import { useState } from "react";

const Preferences = () => {
    const [preferences, setPreferences] = useState([
        {
            id: "emailNotifications",
            label: "Email Notifications",
            description: "Receive email notifications for prediction results and alerts",
            checked: true
        },
        {
            id: "maintenanceReminders",
            label: "Maintenance Reminders",
            description: "Receive reminders when transformer maintenance is recommended",
            checked: true
        }
    ]);

    const togglePreference = (id: string) => {
        setPreferences((prev) =>
            prev.map((pref) =>
                pref.id === id ? { ...pref, checked: !pref.checked } : pref
            )
        );
    };

    return (
        <section id="Preferences">
            <div data-aos="zoom-in" data-aos-duration="500" className="!mt-2 !ring-offset-background !focus-visible:outline-none !focus-visible:ring-2 !focus-visible:ring-ring !focus-visible:ring-offset-2 !space-y-6">
                <div className="!space-y-4">
                    <h3 className="!text-lg !font-semibold">Notification Preferences</h3>
                    {preferences.map((pref) => (
                        <div key={pref.id} className="!space-y-2">
                            <div className="!flex !items-center !justify-between">
                                <label className="!text-sm !font-medium !leading-none peer-disabled:!cursor-not-allowed peer-disabled:!opacity-70" htmlFor={pref.id}>
                                    {pref.label}
                                </label>
                                <input
                                    type="checkbox"
                                    id={pref.id}
                                    className="!h-4 !w-4"
                                    checked={pref.checked}
                                    onChange={() => togglePreference(pref.id)}
                                />
                            </div>
                            <p className="!text-sm !text-gray-400">{pref.description}</p>
                        </div>
                    ))}
                </div>
                <button className="!inline-flex !items-center !justify-center !text-sm !font-medium !bg-white !text-[#020817] hover:!bg-sky-50 !h-10 !px-4 !py-2">
                    <Save size={20} color="#020817" strokeWidth={2} className="me-2" />
                    Save Preferences
                </button>
            </div>
        </section>
    );
};

export default Preferences;
