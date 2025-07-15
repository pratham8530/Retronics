"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRequest = exports.cancelRequest = exports.getSellerRequests = exports.updateRequestStatus = exports.getBuyerRequests = exports.createRequest = void 0;
const request_1 = __importDefault(require("../models/request"));
const Listing_1 = __importDefault(require("../models/Listing"));
const createRequest = async (req, res) => {
    try {
        const { listingId } = req.body;
        const buyerId = req.user._id;
        // Check if listing exists
        const listing = await Listing_1.default.findById(listingId).populate('sellerId');
        if (!listing) {
            return res.status(404).json({ success: false, message: 'Listing not found' });
        }
        // Create request
        const newRequest = await request_1.default.create({
            buyer: buyerId,
            listing: listingId,
            status: 'pending',
            seller: listing.sellerId // Add seller reference
        });
        // Populate for response
        const populatedRequest = await request_1.default.findById(newRequest._id)
            .populate({
            path: 'listing',
            select: 'title price image category',
            populate: {
                path: 'sellerId',
                select: 'firstName lastName'
            }
        })
            .populate('buyer', 'firstName lastName');
        res.status(201).json({
            success: true,
            data: populatedRequest
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.createRequest = createRequest;
// controllers/requestController.ts
const getBuyerRequests = async (req, res) => {
    try {
        const requests = await request_1.default.find({ buyer: req.user._id })
            .populate({
            path: 'listing',
            select: 'title price image category sellerId timeLeft', // Add timeLeft
            populate: {
                path: 'sellerId', // Match Listing schema field name
                model: 'User', // Explicitly specify model
                select: 'firstName lastName email address' // Confirm fields exist in User
            }
        })
            .lean(); // Convert to plain JS object
        res.status(200).json({ success: true, data: requests });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getBuyerRequests = getBuyerRequests;
const updateRequestStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { id: requestId } = req.params; // Get request ID from URL params
        const sellerId = req.user._id; // Get seller ID from authenticated user
        // Define valid statuses a seller can set
        const validSellerStatuses = ['accepted', 'rejected'];
        if (!validSellerStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: `Invalid status update by seller. Must be one of: ${validSellerStatuses.join(', ')}` });
        }
        // Find the request first to verify ownership and current status
        const request = await request_1.default.findById(requestId);
        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }
        // --- SECURITY CHECK: Ensure the logged-in user is the seller for this request ---
        if (request.seller.toString() !== sellerId.toString()) {
            return res.status(403).json({ success: false, message: 'You are not authorized to update this request' });
        }
        // Optional: Check if the request is still in 'pending' state before allowing accept/reject
        if (request.status !== 'pending') {
            return res.status(400).json({ success: false, message: `Request is no longer pending (current status: ${request.status})` });
        }
        // Proceed with the update
        request.status = status;
        request.updatedAt = new Date(); // Manually update updatedAt if not using mongoose timestamps plugin for updates
        const updatedRequest = await request.save();
        // Populate details for the response if needed (optional, depends on frontend needs)
        const populatedUpdateRequest = await request_1.default.findById(updatedRequest._id)
            .populate({ path: 'listing', select: 'title' })
            .populate({ path: 'buyer', select: 'firstName lastName' });
        res.status(200).json({ success: true, data: populatedUpdateRequest });
    }
    catch (error) {
        console.error("Error updating request status:", error); // Log error
        res.status(500).json({ success: false, message: 'Failed to update request status', error: error.message });
    }
};
exports.updateRequestStatus = updateRequestStatus;
const getSellerRequests = async (req, res) => {
    try {
        const sellerId = req.user._id; // Get seller ID from authenticated user
        const requests = await request_1.default.find({ seller: sellerId })
            .populate({
            path: 'listing', // Populate listing details
            select: 'title image price category', // Select desired fields
        })
            .populate({
            path: 'buyer', // Populate buyer details
            select: 'firstName lastName email', // Select desired fields
        })
            .sort({ createdAt: -1 }) // Sort by newest first
            .lean(); // Use lean for performance if not modifying docs
        res.status(200).json({ success: true, data: requests });
    }
    catch (error) {
        console.error("Error fetching seller requests:", error); // Log error
        res.status(500).json({ success: false, message: 'Failed to fetch requests', error: error.message });
    }
};
exports.getSellerRequests = getSellerRequests;
// requestController.ts
const cancelRequest = async (req, res) => {
    try {
        const request = await request_1.default.findOneAndUpdate({
            _id: req.params.id,
            buyer: req.user._id, // Ensure buyer owns the request
            status: 'pending' // Only allow cancellation of pending requests
        }, { status: 'cancelled' }, { new: true });
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found or cannot be cancelled'
            });
        }
        res.status(200).json({ success: true, data: request });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.cancelRequest = cancelRequest;
// Add this new controller function
const deleteRequest = async (req, res) => {
    try {
        const deletedRequest = await request_1.default.findOneAndDelete({
            _id: req.params.id,
            buyer: req.user._id,
            status: 'cancelled' // Only allow deleting cancelled requests
        });
        if (!deletedRequest) {
            return res.status(404).json({
                success: false,
                message: 'Cancelled request not found or already removed'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Request removed successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.deleteRequest = deleteRequest;
