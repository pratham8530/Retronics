import { Router } from "express";
import { getSellersWithListings } from "../controllers/userController";

const router = Router();

// Fetch sellers with their listings
router.get('/sellers-with-listings', getSellersWithListings);

export default router;