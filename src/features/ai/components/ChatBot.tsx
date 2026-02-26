import { X, Send } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { sendChatbotMessage } from "../../../services/ai.api";

interface ChatBotProps {
    setActive: (value: boolean) => void;
    setHideIcon: (value: boolean) => void;
}

interface Message {
    from: "user" | "bot";
    text: string;
}

function ChatBot({ setActive, setHideIcon }: ChatBotProps) {
    const [messages, setMessages] = useState<Message[]>([
        { from: "bot", text: "👋 Hello there! How can I help you today?" },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    // 🔹 عند الإرسال
    const handleSend = async () => {
        if (!input.trim()) return;
        const userMessage = input.trim();

        // أضف رسالة المستخدم أولًا
        setMessages((prev) => [...prev, { from: "user", text: userMessage }]);
        setInput("");
        setLoading(true);

        try {
            // 🔹 إرسال الطلب للباكند
            const res = await sendChatbotMessage(userMessage);

            const data = await res.json();

            // 🔹 أضف رد البوت
            setMessages((prev) => [
                ...prev,
                { from: "bot", text: data.reply || "Sorry, I didn’t get that." },
            ]);
        } catch {

            setMessages((prev) => [
                ...prev,
                { from: "bot", text: "⚠️ Error connecting to the server." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    // 🔹 إغلاق الشات
    const handleClose = () => {
        setActive(false);
        setHideIcon(true);
        setTimeout(() => setHideIcon(false), 400);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-[500px] h-[550px] bg-white rounded-2xl shadow-2xl border border-primary/40 overflow-hidden flex flex-col"
        >
            {/* Header */}
            <div className="bg-primary text-white p-4 font-semibold flex justify-between items-center">
                <span>Chat Assistant</span>
                <button className="cursor-pointer hover:text-primary-600 transition-all duration-150 ease-in-out" onClick={handleClose}>
                    <X size={22} />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-gray-800">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"
                            }`}
                    >
                        <span
                            className={`px-3 py-2 rounded-xl text-sm max-w-8/12 ${msg.from === "user"
                                    ? "bg-primary text-white rounded-br-none"
                                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                                }`}
                        >
                            {msg.text}
                        </span>
                    </div>
                ))}
                {loading && <p className="text-gray-400 text-sm">Bot is typing...</p>}
            </div>

            {/* Input */}
            <div className="border-t p-3 flex items-center gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type your message..."
                    className="flex-1 border rounded-lg p-2 outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                    onClick={handleSend}
                    className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90 transition"
                    disabled={loading}
                >
                    <Send size={18} />
                </button>
            </div>
        </motion.div>
    );
}

export default ChatBot;
