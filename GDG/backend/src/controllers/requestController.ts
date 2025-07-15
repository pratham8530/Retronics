import { Request, Response } from 'express';
import RequestModel from '../models/request';
import Listing from '../models/Listing';
import { AuthRequest } from '../types';

export const createRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { listingId } = req.body;
    const buyerId = req.user!._id;

    // Check if listing exists
    const listing = await Listing.findById(listingId).populate('sellerId');
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    // Create request
    const newRequest = await RequestModel.create({
      buyer: buyerId,
      listing: listingId,
      status: 'pending',
      seller: listing.sellerId // Add seller reference
    });

    // Populate for response
    const populatedRequest = await RequestModel.findById(newRequest._id)
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

  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// controllers/requestController.ts
export const getBuyerRequests = async (req: AuthRequest, res: Response) => {
  try {
    const requests = await RequestModel.find({ buyer: req.user!._id })
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateRequestStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const { id: requestId } = req.params; // Get request ID from URL params
    const sellerId = req.user!._id; // Get seller ID from authenticated user

    // Define valid statuses a seller can set
    const validSellerStatuses = ['accepted', 'rejected'];
    if (!validSellerStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status update by seller. Must be one of: ${validSellerStatuses.join(', ')}` });
    }

    // Find the request first to verify ownership and current status
    const request = await RequestModel.findById(requestId);

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
    const populatedUpdateRequest = await RequestModel.findById(updatedRequest._id)
      .populate({ path: 'listing', select: 'title' })
      .populate({ path: 'buyer', select: 'firstName lastName' });


    res.status(200).json({ success: true, data: populatedUpdateRequest });

  } catch (error: any) {
    console.error("Error updating request status:", error); // Log error
    res.status(500).json({ success: false, message: 'Failed to update request status', error: error.message });
  }
};


export const getSellerRequests = async (req: AuthRequest, res: Response) => {
  try {
    const sellerId = req.user!._id; // Get seller ID from authenticated user

    const requests = await RequestModel.find({ seller: sellerId })
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

  } catch (error: any) {
    console.error("Error fetching seller requests:", error); // Log error
    res.status(500).json({ success: false, message: 'Failed to fetch requests', error: error.message });
  }
};

// requestController.ts
export const cancelRequest = async (req: AuthRequest, res: Response) => {
  try {
    const request = await RequestModel.findOneAndUpdate(
      { 
        _id: req.params.id,
        buyer: req.user!._id, // Ensure buyer owns the request
        status: 'pending' // Only allow cancellation of pending requests
      },
      { status: 'cancelled' },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found or cannot be cancelled'
      });
    }

    res.status(200).json({ success: true, data: request });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add this new controller function
export const deleteRequest = async (req: AuthRequest, res: Response) => {
  try {
    const deletedRequest = await RequestModel.findOneAndDelete({
      _id: req.params.id,
      buyer: req.user!._id,
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
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};