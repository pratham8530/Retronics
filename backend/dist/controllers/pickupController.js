"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.completePickup = exports.schedulePickup = void 0;
const Pickup_1 = __importDefault(require("../models/Pickup"));
const axios_1 = __importDefault(require("axios"));
const schedulePickup = async (req, res) => {
    try {
        const { area, colony, facilityName, facilityAddress, pickupDate } = req.body;
        // Fetch scrap listings from the /scrap endpoint
        const scrapResponse = await axios_1.default.get("${import.meta.env.VITE_API_BASE_URL}/api/listings/scrap");
        const scrapListings = scrapResponse.data.data;
        // Filter listings based on area or colony
        const filteredListings = scrapListings.filter((listing) => {
            if (area && listing.address.area.toLowerCase() === area.trim().toLowerCase()) {
                return true;
            }
            if (colony && listing.address.colony.toLowerCase() === colony.trim().toLowerCase()) {
                return true;
            }
            return false;
        });
        if (filteredListings.length === 0) {
            res.status(404).json({
                success: false,
                message: "No scrap listings found in the specified area or colony.",
            });
            return;
        }
        // Create pickup records for the filtered listings
        const pickups = await Promise.all(filteredListings.map(async (listing) => {
            return Pickup_1.default.create({
                listingId: listing.listingId, // Use listing ID from the /scrap data
                sellerId: listing.sellerId, // Use seller ID from the /scrap data
                area: listing.address.area,
                colony: listing.address.colony,
                facilityName,
                facilityAddress,
                pickupDate,
            });
        }));
        res.status(201).json({
            success: true,
            message: "Pickup scheduled successfully.",
            data: pickups,
        });
    }
    catch (error) {
        console.error("Error scheduling pickup:", error);
        res.status(500).json({
            success: false,
            message: "Failed to schedule pickup.",
        });
    }
};
exports.schedulePickup = schedulePickup;
const completePickup = async (req, res) => {
    try {
        const { pickupId } = req.params;
        const pickup = await Pickup_1.default.findByIdAndUpdate(pickupId, { status: "completed" }, { new: true });
        if (!pickup) {
            res.status(404).json({
                success: false,
                message: "Pickup not found.",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Pickup marked as completed.",
            data: pickup,
        });
    }
    catch (error) {
        console.error("Error completing pickup:", error);
        res.status(500).json({
            success: false,
            message: "Failed to complete pickup.",
        });
    }
};
exports.completePickup = completePickup;
