import React, { useState, useEffect, useRef } from "react";
import { socket } from "@/socket";
import axios from "axios";
import { X, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatWidgetProps {
    receiverId: string;
    receiverName: string;
    onClose: () => void;
    conversationId?: string;
}

interface Message {
    _id: string;
    sender: {
        _id: string;
        id?: string;
        userId?: string;
        firstName?: string;
    };
    text: string;
    createdAt: string;
}

const getCurrentUserId = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id;
    } catch (e) {
        console.error("Failed to parse auth token:", e);
        return null;
    }
};

export function ChatWidget({ receiverId, receiverName, onClose, conversationId: knownConversationId }: ChatWidgetProps) {
    const currentUserId = getCurrentUserId();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [conversationId, setConversationId] = useState<string | null>(knownConversationId || null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    if (currentUserId && receiverId === currentUserId) {
        console.warn("Attempted to open a chat with oneself. Aborting widget render.");
        return null;
    }

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (!currentUserId) return;
        const initializeChat = async () => {
            try {
                let finalConversationId = knownConversationId;
                if (!finalConversationId) {
                    if (!receiverId) return;
                    const res = await axios.post(
                        `${import.meta.env.VITE_API_BASE_URL}/api/chat/conversations`,
                        { senderId: currentUserId, receiverId: receiverId },
                        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                    );
                    finalConversationId = res.data._id;
                    setConversationId(finalConversationId);
                }
                if (finalConversationId) {
                    const messagesRes = await axios.get(
                        `${import.meta.env.VITE_API_BASE_URL}/api/chat/conversations/${finalConversationId}/messages`,
                        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                    );
                    setMessages(messagesRes.data);
                }
            } catch (err) {
                console.error("Failed to initialize chat:", err);
            }
        };
        initializeChat();
    }, [currentUserId, receiverId, knownConversationId]);

    // Handles Socket.IO connection and events
    useEffect(() => {
        if (!conversationId || !currentUserId) return;

        // =========================================================
        // 1. FIX: AUTHENTICATE THE SOCKET CONNECTION
        // The socket needs the same auth token as your API calls.
        // We attach it to the `auth` object before connecting.
        // =========================================================
        const token = localStorage.getItem("token");
        if (token) {
            socket.auth = { token };
        } else {
            console.error("No token found, socket connection aborted.");
            return;
        }

        // Now, we can connect. The server will use the token to authenticate.
        socket.connect();
        socket.emit("join_room", conversationId);

        // =========================================================
        // 2. FIX: ROBUST MESSAGE HANDLER TO PREVENT DUPLICATES
        // This function will replace your temporary optimistic message
        // with the final, saved message from the server.
        // =========================================================
        const handleReceiveMessage = (message: Message) => {
            setMessages((prevMessages) => {
                // If the incoming message is from the current user, it's a confirmation
                // of an optimistic message. We find the temp message and replace it.
                if (message.sender._id === currentUserId) {
                    const tempMessageIndex = prevMessages.findIndex(
                        (msg) => msg._id.startsWith('temp-') && msg.text === message.text
                    );
                    if (tempMessageIndex !== -1) {
                        const newMessages = [...prevMessages];
                        newMessages[tempMessageIndex] = message; // Replace with final message from server
                        return newMessages;
                    }
                }

                // If it's a message from the other user, or we can't find the temp one,
                // add it to the list, but only if it's not already there.
                if (!prevMessages.some(msg => msg._id === message._id)) {
                    return [...prevMessages, message];
                }

                return prevMessages; // If it's a duplicate, do nothing
            });
        };

        socket.on("receive_message", handleReceiveMessage);

        return () => {
            socket.off("receive_message", handleReceiveMessage);
            socket.emit("leave_room", conversationId);
            socket.disconnect();
        };
    }, [conversationId, currentUserId]); // Added currentUserId to dependency array

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === "" || !currentUserId || !conversationId) return;

        socket.emit("send_message", {
            conversationId,
            senderId: currentUserId,
            text: newMessage,
        });

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
                    <h3 className="font-semibold text-gray-800">Chat with {receiverName}</h3>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7">
                    <X className="h-5 w-5" />
                </Button>
            </header>

            <main className="flex-1 p-3 overflow-y-auto bg-gray-50">
                <div className="space-y-4">
                    {messages.map((msg) => {
                        const senderId = msg.sender?._id || msg.sender?.id || msg.sender?.userId;
                        const isMyMessage = senderId && currentUserId && String(senderId) === String(currentUserId);

                        return (
                            <div
                                key={msg._id}
                                className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-xs px-3 py-2 rounded-lg ${isMyMessage
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-200 text-gray-800"
                                        }`}
                                >
                                    <p>{msg.text}</p>
                                </div>
                            </div>
                        );
                    })}
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