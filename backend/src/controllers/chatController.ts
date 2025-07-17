import { Response } from "express";
import Listing from "../models/Listing";
import { AuthRequest } from "../types";
import Message from "../models/Message";
import Conversation from "../models/Conversation";
import mongoose from "mongoose";

// @desc    Get seller's info specifically for initiating a chat
// @route   GET /api/chat/seller-info/:listingId
// @access  Private
export const getSellerInfoForChat = async (req: AuthRequest, res: Response) => {
  try {
    const { listingId } = req.params;

    if (!listingId) {
      // MODIFIED: Removed 'return'
      res
        .status(400)
        .json({ success: false, message: "Listing ID is required" });
      return; // Use a standalone return to exit the function
    }

    // Find the listing and populate the seller's details
    const listing = await Listing.findById(listingId).populate({
      path: "sellerId",
      model: "User",
      select: "_id firstName lastName",
    });

    if (!listing) {
      // MODIFIED: Removed 'return'
      res.status(404).json({ success: false, message: "Listing not found" });
      return; // Use a standalone return to exit the function
    }

    // Check if seller information was successfully populated
    const seller = listing.sellerId as any;
    if (!seller || !seller._id) {
      // MODIFIED: Removed 'return'
      res
        .status(404)
        .json({ success: false, message: "Seller for this listing not found" });
      return; // Use a standalone return to exit the function
    }

    // This line was already correct, no 'return' here.
    res.status(200).json({
      success: true,
      data: {
        sellerId: seller._id,
        sellerName: `${seller.firstName} ${seller.lastName}`,
      },
    });
  } catch (error: any) {
    console.error("Error fetching seller info for chat:", error);
    // This line was already correct, no 'return' here.
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get or create a conversation between two users
// @route   POST /api/conversations
// @access  Private
export const getOrCreateConversation = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { senderId, receiverId } = req.body;

    // Validate input
    if (!senderId || !receiverId) {
      // No return here
      res.status(400).json({
        success: false,
        message: "senderId and receiverId are required",
      });
      return; // Use a plain return to exit the function early
    }

    // Ensure they are valid ObjectId strings before querying
    if (
      !mongoose.Types.ObjectId.isValid(senderId) ||
      !mongoose.Types.ObjectId.isValid(receiverId)
    ) {
      console.error("Invalid ObjectId format provided.");
      // No return here
      res.status(400).json({ success: false, message: "Invalid ID format." });
      return; // Use a plain return to exit the function early
    }

    // Convert to ObjectIds for a more reliable query
    const participantIds = [
      new mongoose.Types.ObjectId(senderId),
      new mongoose.Types.ObjectId(receiverId),
    ];

    let conversation = await Conversation.findOne({
      participants: { $all: participantIds },
    });

    if (!conversation) {
      console.log("No existing conversation found. Creating a new one.");
      conversation = await Conversation.create({
        participants: participantIds,
      });
      console.log("New conversation created:", conversation);
      // No return here: Send response and finish.
      res.status(201).json(conversation);
    } else {
      // No return here: Send response and finish.
      res.status(200).json(conversation);
    }
  } catch (error: any) {
    console.error("Error in getOrCreateConversation:", error);
    // This was already correct, as it didn't have a 'return'
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc    Get all messages for a specific conversation
// @route   GET /api/conversations/:conversationId/messages
// @access  Private
export const getMessagesForConversation = async (req: AuthRequest, res: Response) => {
  try {
    const { conversationId } = req.params;

    if (!conversationId) {
        res.status(400).json({ success: false, message: 'Conversation ID is required' });
        return;
    }
    
    // Find all messages belonging to this conversation
    const messages = await Message.find({ conversationId: conversationId })
      .populate('sender', '_id firstName') // Populate sender info
      .sort({ createdAt: 'asc' }); // Sort by oldest first for chat history

    res.status(200).json(messages);

  } catch (error: any) {
    console.error("Error in getMessagesForConversation:", error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get all conversations for the currently logged-in user
// @route   GET /api/chat/my-conversations
// @access  Private
export const getMyConversations = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ success: false, message: "Not authorized" });
      return;
    }

    // --- NEW: Using an Aggregation Pipeline for Performance ---
    const conversations = await Conversation.aggregate([
      // Stage 1: Find all conversations the current user is part of.
      {
        $match: {
          participants: new mongoose.Types.ObjectId(userId),
        },
      },
      // Stage 2: Look up the last message for each conversation.
      {
        $lookup: {
          from: "messages", // The name of your messages collection in MongoDB
          let: { convoId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$conversationId", "$$convoId"] } } },
            { $sort: { createdAt: -1 } }, // Sort messages by newest first
            { $limit: 1 }, // Take only the most recent one
          ],
          as: "lastMessage", // Store the result in a field named 'lastMessage'
        },
      },
      // Stage 3: Deconstruct the 'lastMessage' array to be a single object.
      // We use preserveNullAndEmptyArrays to keep conversations that have no messages yet.
      {
        $unwind: {
          path: "$lastMessage",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Stage 4: Look up the details of all participants.
      {
        $lookup: {
          from: "users", // The name of your users collection
          localField: "participants",
          foreignField: "_id",
          as: "participantDetails",
        },
      },
      // Stage 5: Shape the final output for the frontend.
      {
        $project: {
          _id: 1,
          updatedAt: 1,
          lastMessage: 1, // Include the last message object
          // Filter the participantDetails to find the 'other' participant.
          otherParticipant: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$participantDetails",
                  as: "participant",
                  cond: {
                    $ne: [
                      "$$participant._id",
                      new mongoose.Types.ObjectId(userId),
                    ],
                  },
                },
              },
              0,
            ],
          },
        },
      },
      // Stage 6: Clean up the 'otherParticipant' field to only include needed data
      {
        $project: {
          _id: 1,
          updatedAt: 1,
          lastMessage: 1,
          "otherParticipant._id": 1,
          "otherParticipant.firstName": 1,
          "otherParticipant.lastName": 1,
        },
      },
      // Stage 7: Sort conversations so the ones with the most recent messages appear first.
      {
        $sort: { "lastMessage.createdAt": -1, updatedAt: -1 },
      },
    ]);

    res.status(200).json(conversations);
  } catch (error: any) {
    console.error("Error fetching user conversations:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};