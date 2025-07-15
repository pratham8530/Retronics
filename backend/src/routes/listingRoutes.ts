import { Router } from 'express';
import * as listingController from '../controllers/listingController';
import { protect, restrictTo } from '../middleware/authMiddleware';
import upload from '../middleware/uploadMiddleware';
import { getScrapListings } from "../controllers/listingController";

const router = Router();

// Public routes
router.get('/', listingController.getAllListings);

router.get("/scrap", getScrapListings);
// ✅ Move `/seller` above `/:id`
router.get('/seller', protect, restrictTo('seller'), listingController.getSellerListings);

router.get('/:id', listingController.getListingById);

// Protected routes (Authentication required)
router.use(protect);

// Seller-only routes
router.post(
  '/',
  restrictTo('seller'),
  upload.single('image'),
  listingController.createListing
);

router.put(
  '/:id',
  restrictTo('seller'),
  upload.single('image'),
  listingController.updateListing
);

router.delete(
  '/:id',
  restrictTo('seller'),
  listingController.deleteListing
);

export default router;
