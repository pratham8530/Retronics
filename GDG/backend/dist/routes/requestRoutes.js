"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const requestController_1 = require("../controllers/requestController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Add proper type casting for middleware
router.use(authMiddleware_1.protect); // Protect all request routes
// Buyer creates a request
router.post('/', (0, authMiddleware_1.restrictTo)('buyer'), requestController_1.createRequest);
// Buyer gets their own requests
router.get('/buyer', (0, authMiddleware_1.restrictTo)('buyer'), requestController_1.getBuyerRequests);
// --- NEW: Seller gets requests directed to them ---
router.get('/seller', // Define a distinct path for seller requests
(0, authMiddleware_1.restrictTo)('seller'), // Only sellers can access this
requestController_1.getSellerRequests // Use the new controller function
);
// Seller updates the status of a request (Accept/Reject)
router.patch('/:id/status', // Keep the existing path for status updates
(0, authMiddleware_1.restrictTo)('seller'), // Only sellers can update status via this route
requestController_1.updateRequestStatus);
// Buyer cancels their *own* pending request (adjust path/logic if needed)
router.patch('/:id/cancel', // Example: Use a dedicated path for cancellation
(0, authMiddleware_1.restrictTo)('buyer'), requestController_1.cancelRequest // Assuming cancelRequest logic is correct for buyers
);
router.delete('/:id', (0, authMiddleware_1.restrictTo)('buyer'), requestController_1.deleteRequest // Ensure this is the correct function for deleting requests
);
// Consider if sellers should be able to cancel too under certain conditions? If so, add another route or modify logic.
exports.default = router;
