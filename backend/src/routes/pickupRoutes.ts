import express from "express";
import { schedulePickup, completePickup } from "../controllers/pickupController";

const router = express.Router();

// Route to schedule a pickup
router.post("/schedule", schedulePickup);

// Route to mark a pickup as completed
router.patch("/complete/:pickupId", completePickup);

export default router;