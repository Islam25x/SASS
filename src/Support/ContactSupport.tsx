import { useRef, FormEvent } from "react";

const ContactSupport = () => {
    const form = useRef<HTMLFormElement>(null);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        alert("Form submitted (demo only, no email service connected).");
        form.current?.reset();
    };

    return (
        <section id="ContactSupport">
            <div
                data-aos="zoom-in"
                data-aos-duration="500"
                className="bg-white border h-fit border-gray-300 p-6 relative rounded-lg shadow-sm"
            >
                <h2 className="text-xl font-semibold mb-6 text-gray-900">
                    Contact Support
                </h2>
                <form ref={form} onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label htmlFor="Subject" className="text-gray-700 font-medium">
                            Subject
                        </label>
                        <input
                            type="text"
                            placeholder="Enter subject"
                            name="Subject"
                            className="flex w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="space-y-2 my-4">
                        <label htmlFor="Message" className="text-gray-700 font-medium">
                            Message
                        </label>
                        <textarea
                            placeholder="Describe your issue..."
                            name="Message"
                            className="flex w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="Attachment" className="text-gray-700 font-medium">
                            Attachment (optional)
                        </label>
                        <input
                            type="file"
                            name="Attachment"
                            className="flex w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        Send
                    </button>
                </form>
            </div>
        </section>
    );
};

export default ContactSupport;
