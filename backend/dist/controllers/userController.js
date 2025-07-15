"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSellersWithListings = void 0;
const User_1 = __importDefault(require("../models/User"));
const Listing_1 = __importDefault(require("../models/Listing"));
// Fetch sellers with their listings
const getSellersWithListings = async (req, res) => {
    try {
        // Fetch all sellers from the User collection
        const sellers = await User_1.default.find({ userType: "seller" }).lean();
        // Fetch all listings from the Listing collection
        const listings = await Listing_1.default.find().lean();
        // Map sellers to include their listings
        const sellersWithListings = sellers.map((seller) => {
            // Filter listings for the current seller
            const sellerListings = listings.filter((listing) => listing.sellerId.toString() === seller._id.toString());
            return {
                name: `${seller.firstName} ${seller.lastName}`, // Combine first and last name
                address: {
                    city: seller.address.city, // City from the User collection
                    area: seller.address.area, // Area from the User collection
                    colony: seller.address.colony, // Colony from the User collection
                    coordinates: seller.address.coordinates, // Coordinates from the User collection
                },
                items: sellerListings.map((listing) => listing.title), // Titles of the seller's listings
                estimatedWeight: `${sellerListings.reduce((sum, listing) => sum + (listing.estimatedWeight || 0), // Sum up the weights of the listings
                0)} kg`,
            };
        });
        // Send the response with the sellers and their listings
        res.status(200).json({
            success: true,
            data: sellersWithListings,
        });
    }
    catch (error) {
        // Handle errors and send a 500 response
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getSellersWithListings = getSellersWithListings;
