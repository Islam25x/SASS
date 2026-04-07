import { useState } from "react";
import { Send } from "lucide-react";
import { sendChatMessageUseCase } from "../../../application/ai/send-chat-message.usecase";
import { Button, Card, Input, Text } from "../../../shared/ui";

interface Message {
    id: number;
    text: string;
    sender: "user" | "ai";
}

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
            const response = await sendChatMessageUseCase(input);

            const data = await response.json();
            const aiResponse =
                data.reply || data.message || "Error getting response";

            setMessages((prev) => [
                ...prev,
                { id: Date.now(), text: aiResponse, sender: "ai" },
            ]);
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : "Unexpected error";
            setMessages((prev) => [
                ...prev,
                { id: Date.now(), text: `Error: ${message}`, sender: "ai" },
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
            <Card variant="outline" padding="sm" className="shadow-md h-[550px] flex flex-col p-0 rounded-lg">
                {/* Header */}
                <div className="px-6 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                    <Text as="h2" variant="subtitle" weight="bold" className="text-gray-800">
                        Chat Agent
                    </Text>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`max-w-[75%] px-4 py-2 rounded-lg ${msg.sender === "ai"
                                    ? "bg-gray-100 text-gray-800 self-start"
                                    : "bg-primary text-white self-end ml-auto"
                                }`}
                        >
                            {msg.text}
                        </div>
                    ))}
                    {loading && (
                        <Text variant="body" className="text-gray-400">
                            AI is typing...
                        </Text>
                    )}
                </div>

                {/* Input */}
                <div className="border-t border-gray-200 p-3 flex items-center gap-2 bg-gray-50 rounded-b-lg">
                    <Input
                        type="text"
                        placeholder="Type your message..."
                        className="flex-1 h-11"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={loading}
                    />
                    <Button
                        onClick={handleSendMessage}
                        variant="primary"
                        size="sm"
                        disabled={loading}
                        shape="circle"
                        className="p-0"
                    >
                        <Send size={18} strokeWidth={1.75} />
                    </Button>
                </div>
            </Card>
        </section>
    );
};

export default AI;

