"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecyclingCenterById = exports.getNearbyRecyclingCenters = exports.getAllRecyclingCenters = void 0;
const RecyclingCenter_1 = __importDefault(require("../models/RecyclingCenter"));
// Get all recycling centers
const getAllRecyclingCenters = async () => {
    const recyclingCenters = await RecyclingCenter_1.default.find().sort({ createdAt: -1 });
    return recyclingCenters.map(center => ({
        _id: center._id,
        name: center.name,
        address: center.address,
        phone: center.phone,
        hours: center.hours,
        location: center.location,
        createdAt: center.createdAt,
        updatedAt: center.updatedAt,
        acceptedItems: center.acceptedItems,
    }));
};
exports.getAllRecyclingCenters = getAllRecyclingCenters;
// Get nearby recycling centers
const getNearbyRecyclingCenters = async (lat, lng) => {
    const recyclingCenters = await RecyclingCenter_1.default.find({
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [lng, lat],
                },
                $maxDistance: 10000, // 10 km radius
            },
        },
    });
    return recyclingCenters;
};
exports.getNearbyRecyclingCenters = getNearbyRecyclingCenters;
// Get recycling center by ID
const getRecyclingCenterById = async (id) => {
    const recyclingCenter = await RecyclingCenter_1.default.findById(id);
    return recyclingCenter;
};
exports.getRecyclingCenterById = getRecyclingCenterById;
