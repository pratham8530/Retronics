import { Router } from 'express';
import * as recyclingController from '../controllers/recyclingController';

const router = Router();

// Public routes
router.get('/', recyclingController.getAllRecyclingCenters);
router.get('/nearby', recyclingController.getNearbyRecyclingCenters);
router.get('/:id', recyclingController.getRecyclingCenterById);

export default router;