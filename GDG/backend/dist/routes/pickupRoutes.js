"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pickupController_1 = require("../controllers/pickupController");
const router = express_1.default.Router();
// Route to schedule a pickup
router.post("/schedule", pickupController_1.schedulePickup);
// Route to mark a pickup as completed
router.patch("/complete/:pickupId", pickupController_1.completePickup);
exports.default = router;
