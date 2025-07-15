import React, { useState, useEffect, useRef } from "react";
import { socket } from "@/socket"; // Import the socket instance
import axios from "axios";
import { X, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatWidgetProps {
    sellerId: string;
    sellerName: string;
    onClose: () => void;
}

interface Message {
    _id: string;
    sender: {
        _id: string;
        firstName?: string; // Make sender fields optional for robustness
    };
    text: string;
    createdAt: string;
}

// Get the current user's ID from local storage (or your auth context)
const getCurrentUserId = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id;
    } catch (e) {
        return null;
    }
}


export function ChatWidget({ sellerId, sellerName, onClose }: ChatWidgetProps) {
    const currentUserId = getCurrentUserId();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [conversationId, setConversationId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to the latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Effect to establish conversation and fetch messages
    useEffect(() => {
        if (!currentUserId || !sellerId) return;

        // 1. Get or create the conversation to get its ID
        const getConversation = async () => {
            try {
                const res = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/api/conversations`,
                    { senderId: currentUserId, receiverId: sellerId },
                    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                );
                const convId = res.data._id;
                setConversationId(convId);

                // 2. Fetch past messages for this conversation
                const messagesRes = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/api/conversations/${convId}/messages`,
                    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                );
                setMessages(messagesRes.data);
            } catch (err) {
                console.error("Failed to initialize chat:", err);
            }
        };
        getConversation();
    }, [currentUserId, sellerId]);

    // Effect for real-time socket connection
    useEffect(() => {
        if (!conversationId) return;

        // Connect to socket and join the private room for this conversation
        socket.connect();
        socket.emit("join_room", conversationId);

        const handleReceiveMessage = (message: Message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        };

        socket.on("receive_message", handleReceiveMessage);

        // Clean up on component unmount
        return () => {
            socket.off("receive_message", handleReceiveMessage);
            socket.disconnect();
        };
    }, [conversationId]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === "" || !currentUserId || !conversationId) return;

        // Emit the message via socket
        socket.emit("send_message", {
            conversationId,
            senderId: currentUserId,
            text: newMessage,
        });

        // Optimistically update the UI
        const optimisticMessage: Message = {
            _id: `temp-${Date.now()}`,
            sender: { _id: currentUserId },
            text: newMessage,
            createdAt: new Date().toISOString()
        };
        setMessages(prev => [...prev, optimisticMessage]);
        setNewMessage("");
    };

    if (!currentUserId) {
        return (
            <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col items-center justify-center">
                <p className="p-4 text-center">Please log in to chat with the seller.</p>
                <Button onClick={onClose} variant="ghost">Close</Button>
            </div>
        )
    }

    return (
        <div className="fixed bottom-4 right-4 w-80 md:w-96 bg-white rounded-lg shadow-xl flex flex-col z-50">
            <header className="flex items-center justify-between p-3 bg-gray-100 border-b rounded-t-lg">
                <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-gray-700" />
                    <h3 className="font-semibold text-gray-800">Chat with {sellerName}</h3>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7">
                    <X className="h-5 w-5" />
                </Button>
            </header>
            <main className="flex-1 p-3 overflow-y-auto bg-gray-50">
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <div
                            key={msg._id}
                            className={`flex ${msg.sender._id === currentUserId ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-xs px-3 py-2 rounded-lg ${msg.sender._id === currentUserId
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 text-gray-800"
                                    }`}
                            >
                                <p>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </main>
            <footer className="p-2 border-t">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <Input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1"
                        autoComplete="off"
                    />
                    <Button type="submit" size="icon">
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </footer>
        </div>
    );
}