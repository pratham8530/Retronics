"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleScrapUpdateJob = scheduleScrapUpdateJob;
const node_cron_1 = __importDefault(require("node-cron"));
const Listing_1 = __importDefault(require("../models/Listing"));
const mongoose_1 = __importDefault(require("mongoose"));
async function updateScrapStatus() {
    if (mongoose_1.default.connection.readyState !== 1) {
        console.error('[Scheduler] MongoDB is not connected.');
        return;
    }
    try {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const result = await Listing_1.default.updateMany({
            createdAt: { $lt: thirtyDaysAgo },
            isScrapItem: false,
        }, {
            $set: { isScrapItem: true },
        });
        if (result.modifiedCount > 0) {
            console.log(`[Scheduler] Updated ${result.modifiedCount} listings to scrap items.`);
        }
    }
    catch (error) {
        console.error('[Scheduler] Error updating scrap status:', error);
    }
}
function scheduleScrapUpdateJob() {
    const schedule = '* * * * *'; // Runs every minute
    node_cron_1.default.schedule(schedule, () => {
        updateScrapStatus();
    }, {
        scheduled: true,
        timezone: 'Asia/Kolkata',
    });
}
