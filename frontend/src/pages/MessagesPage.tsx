import { ConversationsInbox } from "@/components/ConversationsList";

export function MessagesPage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Your Conversations</h1>
            <div className="bg-white rounded-lg shadow-md">
                {/* The ConversationsInbox component does all the work! */}
                <ConversationsInbox />
            </div>
        </div>
    );
}