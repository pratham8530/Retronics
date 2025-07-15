import express, { RequestHandler } from 'express';
import {
  createRequest,
  getBuyerRequests,
  updateRequestStatus,
  cancelRequest, // Make sure cancelRequest is imported if needed elsewhere
  getSellerRequests,
  deleteRequest 
} from '../controllers/requestController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = express.Router();

// Add proper type casting for middleware
router.use(protect as RequestHandler); // Protect all request routes

// Buyer creates a request
router.post(
  '/',
  restrictTo('buyer') as RequestHandler,
  createRequest as RequestHandler
);

// Buyer gets their own requests
router.get(
  '/buyer',
  restrictTo('buyer') as RequestHandler,
  getBuyerRequests as RequestHandler
);

// --- NEW: Seller gets requests directed to them ---
router.get(
  '/seller', // Define a distinct path for seller requests
  restrictTo('seller') as RequestHandler, // Only sellers can access this
  getSellerRequests as RequestHandler   // Use the new controller function
);

// Seller updates the status of a request (Accept/Reject)
router.patch(
  '/:id/status', // Keep the existing path for status updates
  restrictTo('seller') as RequestHandler, // Only sellers can update status via this route
  updateRequestStatus as RequestHandler
);

// Buyer cancels their *own* pending request (adjust path/logic if needed)
router.patch(
    '/:id/cancel', // Example: Use a dedicated path for cancellation
    restrictTo('buyer') as RequestHandler,
    cancelRequest as RequestHandler // Assuming cancelRequest logic is correct for buyers
);

router.delete(
  '/:id',
  restrictTo('buyer'),
  deleteRequest as RequestHandler // Ensure this is the correct function for deleting requests
);
// Consider if sellers should be able to cancel too under certain conditions? If so, add another route or modify logic.


export default router;