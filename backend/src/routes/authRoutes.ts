import express from 'express';
import { register, login, getCurrentUser } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', register); // Fix: Directly use controller function
router.post('/login', login); // Fix: Directly use controller function
router.get('/me', protect, getCurrentUser); // Fix: Directly use controller function

export default router;
