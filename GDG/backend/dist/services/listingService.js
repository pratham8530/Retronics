"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteListing = exports.updateListing = exports.createListing = exports.getListingById = exports.getSellerListings = exports.getAllListings = void 0;
const Pickup_1 = __importDefault(require("../models/Pickup"));
const Listing_1 = __importDefault(require("../models/Listing"));
const mongoose_1 = require("mongoose");
// Get all listings
const getAllListings = async () => {
    const listings = await Listing_1.default.find().sort({ createdAt: -1 }).lean(); // Use .lean() to return plain JavaScript objects
    return listings; // Explicitly cast to IListing[]
};
exports.getAllListings = getAllListings;
// Get seller-specific listings
const getSellerListings = async (sellerId) => {
    try {
        const listings = await Listing_1.default.find({ sellerId: new mongoose_1.Types.ObjectId(sellerId) })
            .lean()
            .exec();
        const listingIds = listings.map((listing) => listing._id);
        const pickups = await Pickup_1.default.find({ listingId: { $in: listingIds } })
            .lean()
            .exec();
        const pickupMap = pickups.reduce((acc, pickup) => {
            acc[pickup.listingId.toString()] = {
                facilityName: pickup.facilityName,
                facilityAddress: pickup.facilityAddress,
                pickupDate: pickup.pickupDate,
                status: pickup.status,
            };
            return acc;
        }, {});
        const listingsWithPickups = listings.map((listing) => ({
            ...listing,
            pickupDetails: pickupMap[listing._id.toString()] || null,
        }));
        return listingsWithPickups;
    }
    catch (error) {
        console.error('Error in getSellerListings:', error);
        throw error;
    }
};
exports.getSellerListings = getSellerListings;
// Get listing by ID
const getListingById = async (id) => {
    const listing = await Listing_1.default.findById(id).populate('seller', 'firstName lastName email').lean(); // Use .lean()
    return listing; // Explicitly cast to IListing or null
};
exports.getListingById = getListingById;
// Create listing
const createListing = async (listingData) => {
    const listing = await Listing_1.default.create(listingData);
    return listing.toObject(); // Use .toObject() and explicitly cast to IListing
};
exports.createListing = createListing;
// Update listing
const updateListing = async (id, listingData, sellerId) => {
    const existingListing = await Listing_1.default.findOne({ _id: id, sellerId });
    if (!existingListing) {
        throw new Error('Listing not found or unauthorized');
    }
    const updatedListing = await Listing_1.default.findByIdAndUpdate(id, listingData, {
        new: true,
        runValidators: true,
    })
        .populate('seller', 'firstName lastName email')
        .lean(); // Use .lean()
    if (!updatedListing) {
        throw new Error('Listing not found');
    }
    return updatedListing; // Explicitly cast to IListing
};
exports.updateListing = updateListing;
// Delete listing
const deleteListing = async (id, sellerId) => {
    const existingListing = await Listing_1.default.findOne({ _id: id, sellerId });
    if (!existingListing) {
        throw new Error('Listing not found or unauthorized');
    }
    await Listing_1.default.findByIdAndDelete(id);
};
exports.deleteListing = deleteListing;
