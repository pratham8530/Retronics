import express from "express";
import { getMessagesForConversation, getMyConversations, getOrCreateConversation, getSellerInfoForChat } from "../controllers/chatController"; // Adjust path
import { protect } from "../middleware/authMiddleware"; // Adjust path to your auth middleware

const router = express.Router();

// Define the new route
router.get("/seller-info/:listingId", protect, getSellerInfoForChat);

// Route to get or create a conversation
router.post("/conversations", protect, getOrCreateConversation);

// Route to get all messages for a specific conversation
router.get(
  "/conversations/:conversationId/messages",
  protect,
  getMessagesForConversation
);

// GET all conversations for the logged-in user
router.get("/my-conversations", protect, getMyConversations);

export default router;