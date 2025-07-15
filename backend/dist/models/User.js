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
const mongoose_1 = __importStar(require("mongoose"));
// Define the User schema
const userSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: { type: String, enum: ["seller", "buyer"], required: true },
    address: {
        city: { type: String, required: true },
        area: { type: String, required: true },
        colony: { type: String, required: true },
        coordinates: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true },
        },
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true, // Ensure virtual fields are serialized when using toJSON
        transform: function (doc, ret) {
            ret.userId = ret._id.toString(); // Map _id to userId for API responses
            delete ret._id; // Optionally remove the original _id from the output
            delete ret.__v; // Optionally remove __v
            return ret;
        },
    },
    toObject: {
        virtuals: true, // Ensure virtual fields are serialized when using toObject
        transform: function (doc, ret) {
            ret.userId = ret._id.toString(); // Map _id to userId for JavaScript objects
            delete ret._id; // Optionally remove the original _id from the output
            delete ret.__v; // Optionally remove __v
            return ret;
        },
    },
});
// Export the User model
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
