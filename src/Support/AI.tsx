import { useState } from "react";
import { Send } from "lucide-react";

interface Message {
    id: number;
    text: string;
    sender: "user" | "ai";
}

const API_URL = "https://api.openai.com/v1/chat/completions";
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const AI = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hello! How can I help you today?", sender: "ai" },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSendMessage = async () => {
        if (!input.trim() || loading) return;

        const newMessage: Message = { id: Date.now(), text: input, sender: "user" };
        setMessages((prev) => [...prev, newMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${API_KEY}`,
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: input }],
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            const aiResponse =
                data.choices?.[0]?.message?.content || "Error getting response";

            setMessages((prev) => [
                ...prev,
                { id: Date.now(), text: aiResponse, sender: "ai" },
            ]);
        } catch (error: any) {
            console.error("Fetch Error:", error.message);
            setMessages((prev) => [
                ...prev,
                { id: Date.now(), text: `Error: ${error.message}`, sender: "ai" },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSendMessage();
    };

    return (
        <section id="AI" className="max-w-3xl mx-auto">
            <div className="border border-gray-300 bg-white rounded-lg shadow-md h-[550px] flex flex-col">
                {/* Header */}
                <div className="px-6 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                    <h2 className="text-lg font-semibold text-gray-800">Chat Agent</h2>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`max-w-[75%] px-4 py-2 rounded-lg ${msg.sender === "ai"
                                    ? "bg-gray-100 text-gray-800 self-start"
                                    : "bg-blue-600 text-white self-end ml-auto"
                                }`}
                        >
                            {msg.text}
                        </div>
                    ))}
                    {loading && (
                        <div className="text-gray-400 text-sm">AI is typing...</div>
                    )}
                </div>

                {/* Input */}
                <div className="border-t border-gray-200 p-3 flex items-center gap-2 bg-gray-50 rounded-b-lg">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        className="flex-1 h-11 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={loading}
                    />
                    <button
                        onClick={handleSendMessage}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded flex items-center justify-center disabled:opacity-50"
                        disabled={loading}
                    >
                        <Send size={18} strokeWidth={1.75} />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default AI;
