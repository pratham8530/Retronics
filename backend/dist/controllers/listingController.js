"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScrapListings = exports.getFeaturedListings = exports.deleteListing = exports.updateListing = exports.createListing = exports.getSellerListings = exports.getListingById = exports.getAllListings = void 0;
const listingService = __importStar(require("../services/listingService"));
const Listing_1 = __importDefault(require("../models/Listing"));
const User_1 = __importDefault(require("../models/User"));
const Pickup_1 = __importDefault(require("../models/Pickup"));
// Get all listings
const getAllListings = async (req, res) => {
    try {
        const listings = await listingService.getAllListings();
        res.status(200).json({
            success: true,
            data: listings,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getAllListings = getAllListings;
// Get listing by ID
const getListingById = async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await listingService.getListingById(id);
        if (!listing) {
            res.status(404).json({
                success: false,
                message: 'Listing not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: listing,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getListingById = getListingById;
// Get seller-specific listings
const getSellerListings = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Not authenticated',
            });
            return;
        }
        const sellerId = req.user._id.toString();
        // Use the updated service to get listings with pickup details
        const listings = await listingService.getSellerListings(sellerId);
        res.status(200).json({
            success: true,
            data: listings,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getSellerListings = getSellerListings;
// Create listing
const createListing = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Not authenticated',
            });
            return;
        }
        const sellerId = req.user._id;
        const listingData = {
            ...req.body,
            sellerId,
        };
        const listing = await listingService.createListing(listingData);
        res.status(201).json({
            success: true,
            data: listing,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.createListing = createListing;
// Update listing
const updateListing = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        delete updates.sellerId;
        delete updates.isScrapItem;
        const updatedListing = await Listing_1.default.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });
        if (!updatedListing) {
            res.status(404).json({ success: false, message: 'Listing not found' });
            return;
        }
        res.status(200).json({ success: true, data: updatedListing });
    }
    catch (error) {
        console.error('Error updating listing:', error);
        res.status(500).json({ success: false, message: 'Failed to update listing' });
    }
};
exports.updateListing = updateListing;
// Delete listing
const deleteListing = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Not authenticated',
            });
            return;
        }
        const { id } = req.params;
        const sellerId = req.user._id.toString();
        await listingService.deleteListing(id, sellerId);
        res.status(200).json({
            success: true,
            message: 'Listing deleted successfully',
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.deleteListing = deleteListing;
// Get featured listings
const getFeaturedListings = async (req, res) => {
    try {
        const listings = await Listing_1.default.find({ isScrapItem: false })
            .sort({ createdAt: -1 })
            .limit(4)
            .lean();
        res.status(200).json({
            success: true,
            data: listings,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getFeaturedListings = getFeaturedListings;
// Get scrap listings
const getScrapListings = async (req, res) => {
    try {
        const scrapListings = await Listing_1.default.find({ isScrapItem: true }).lean();
        const sellerIds = scrapListings.map((listing) => listing.sellerId.toString());
        const sellers = await User_1.default.find({ _id: { $in: sellerIds } }).lean();
        const listingIds = scrapListings.map((listing) => listing._id);
        const pickups = await Pickup_1.default.find({ listingId: { $in: listingIds } }).lean();
        const pickupMap = pickups.reduce((acc, pickup) => {
            acc[pickup.listingId.toString()] = {
                facilityName: pickup.facilityName,
                facilityAddress: pickup.facilityAddress,
                pickupDate: pickup.pickupDate,
                status: pickup.status,
            };
            return acc;
        }, {});
        const scrapData = sellers.map((seller) => {
            const sellerListings = scrapListings.filter((listing) => listing.sellerId.toString() === seller._id.toString());
            const listingsWithPickup = sellerListings.map((listing) => ({
                _id: listing._id,
                title: listing.title,
                estimatedWeight: listing.estimatedWeight || 0,
                pickupDetails: pickupMap[listing._id.toString()] || null,
            }));
            return {
                listingId: sellerListings.length > 0 ? sellerListings[0]._id : null,
                sellerId: seller._id.toString(),
                name: `${seller.firstName} ${seller.lastName}`,
                address: {
                    city: seller.address.city,
                    area: seller.address.area,
                    colony: seller.address.colony,
                    coordinates: seller.address.coordinates,
                },
                items: listingsWithPickup.map((listing) => listing.title),
                estimatedWeight: `${listingsWithPickup.reduce((sum, listing) => sum + (listing.estimatedWeight || 0), 0)} kg`,
                listings: listingsWithPickup,
            };
        });
        res.status(200).json({
            success: true,
            data: scrapData,
        });
    }
    catch (error) {
        console.error('Error fetching scrap listings:', error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getScrapListings = getScrapListings;
