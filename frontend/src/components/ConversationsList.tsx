import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChatWidget } from './ChatWidget'; // We'll reuse this

// --- HELPER FUNCTIONS ---

// Generates initials from a name (e.g., "John Smith" -> "JS")
const getInitials = (firstName: string, lastName: string = ''): string => {
    const firstInitial = firstName ? firstName[0].toUpperCase() : '';
    const lastInitial = lastName ? lastName[0].toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
};

// Creates a consistent background color for the avatar based on the name
const generateAvatarColor = (name: string): string => {
    const colors = [
        'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500',
        'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500',
        'bg-cyan-500', 'bg-sky-500', 'bg-blue-500', 'bg-indigo-500',
        'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % colors.length);
    return colors[index];
};

// Formats the date to a simple time string (e.g., "05:40 PM")
const formatTime = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};


// --- INTERFACES ---

interface OtherParticipant {
    _id: string;
    firstName: string;
    lastName: string;
}

// IMPORTANT: Updated interface to include last message details from the backend
interface Conversation {
    _id: string;
    otherParticipant: OtherParticipant;
    // Your backend needs to provide this data for the UI to be complete
    lastMessage?: {
        text: string;
        createdAt: string;
    };
}

// --- COMPONENT ---

export function ConversationsInbox() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeChat, setActiveChat] = useState<Conversation | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchConversations = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get<Conversation[]>(
                    `${import.meta.env.VITE_API_BASE_URL}/api/chat/my-conversations`,
                    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                );
                setConversations(res.data);
            } catch (error) {
                console.error("Failed to fetch conversations", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchConversations();
    }, []);

    const handleOpenChat = (conversation: Conversation) => {
        setActiveChat(conversation);
    };

    const handleCloseChat = () => {
        setActiveChat(null);
    };

    return (
        <div className="flex w-full h-full bg-white rounded-lg shadow-md overflow-hidden">
            {/* Left Panel: Inbox List */}
            <div className="w-full md:w-2/5 lg:w-1/3 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold">Your Messages</h2>
                    {/* You can add a search bar or filters here if needed */}
                </div>

                <ul className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        <p className="p-4 text-gray-500">Loading conversations...</p>
                    ) : conversations.length > 0 ? (
                        conversations.map((convo) => {
                            const fullName = `${convo.otherParticipant.firstName} ${convo.otherParticipant.lastName}`;
                            const isActive = activeChat?._id === convo._id;

                            return (
                                <li
                                    key={convo._id}
                                    onClick={() => handleOpenChat(convo)}
                                    className={`flex items-center p-3 cursor-pointer transition-colors duration-200 ease-in-out
                                        ${isActive ? 'bg-orange-500 text-white' : 'hover:bg-gray-100'}`
                                    }
                                >
                                    {/* Avatar with Initials */}
                                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl ${generateAvatarColor(fullName)}`}>
                                        {getInitials(convo.otherParticipant.firstName, convo.otherParticipant.lastName)}
                                    </div>

                                    {/* Name and Last Message */}
                                    <div className="flex-grow mx-3 overflow-hidden">
                                        <p className="font-semibold truncate">{fullName}</p>
                                        <p className={`text-sm truncate ${isActive ? 'text-orange-100' : 'text-gray-500'}`}>
                                            {convo.lastMessage?.text || 'No messages yet...'}
                                        </p>
                                    </div>

                                    {/* Timestamp */}
                                    <div className="flex-shrink-0 text-xs">
                                        {formatTime(convo.lastMessage?.createdAt || '')}
                                    </div>
                                </li>
                            );
                        })
                    ) : (
                        <p className="p-4 text-gray-500">No conversations yet.</p>
                    )}
                </ul>
            </div>

            {/* Right Panel: Active Chat Window */}
            {/* The ChatWidget will overlay this area due to its 'fixed' positioning */}
            <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gray-50">
                {!activeChat && (
                    <div className="text-center text-gray-400">
                        <p className="text-lg">Select a conversation</p>
                        <p>Your messages will appear here.</p>
                    </div>
                )}
            </div>


            {/* The ChatWidget remains functionally the same, but now it has a dedicated space */}
            {activeChat && (
                <ChatWidget
                    key={activeChat._id}
                    conversationId={activeChat._id}
                    receiverId={activeChat.otherParticipant._id}
                    receiverName={`${activeChat.otherParticipant.firstName} ${activeChat.otherParticipant.lastName}`}
                    onClose={handleCloseChat}
                />
            )}
        </div>
    );
}