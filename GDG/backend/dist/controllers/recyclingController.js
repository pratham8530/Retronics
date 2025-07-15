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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecyclingCenterById = exports.getNearbyRecyclingCenters = exports.getAllRecyclingCenters = void 0;
const recyclingService = __importStar(require("../services/recyclingService"));
// Get all recycling centers controller
const getAllRecyclingCenters = async (req, res) => {
    try {
        const recyclingCenters = await recyclingService.getAllRecyclingCenters();
        res.status(200).json({
            success: true,
            data: { recyclingCenters },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getAllRecyclingCenters = getAllRecyclingCenters;
// Get nearby recycling centers controller
const getNearbyRecyclingCenters = async (req, res) => {
    try {
        const { lat, lng } = req.query;
        const recyclingCenters = await recyclingService.getNearbyRecyclingCenters(Number(lat), Number(lng));
        res.status(200).json({
            success: true,
            data: { recyclingCenters },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getNearbyRecyclingCenters = getNearbyRecyclingCenters;
// Get recycling center by ID controller
const getRecyclingCenterById = async (req, res) => {
    try {
        const { id } = req.params;
        const recyclingCenter = await recyclingService.getRecyclingCenterById(id);
        res.status(200).json({
            success: true,
            data: { recyclingCenter },
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getRecyclingCenterById = getRecyclingCenterById;
