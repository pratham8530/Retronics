"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.login = exports.register = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load environment variables
const bcrypt = require("bcryptjs");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const JWT_SECRET = process.env.JWT_SECRET || "fallbackSecretKey";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "86400"; // Default to 24 hours
console.log("JWT_SECRET:", JWT_SECRET ? "Loaded" : "Not Loaded"); // Debugging
// Helper function to generate JWT token
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ id: userId }, JWT_SECRET, {
        expiresIn: parseInt(JWT_EXPIRES_IN, 10),
    });
};
// Register a new user
const register = async (userData) => {
    const { firstName, lastName, email, password, userType, address } = userData;
    // Check if the user already exists
    const existingUser = await User_1.default.findOne({ email });
    if (existingUser) {
        throw new Error("User already exists");
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create the user
    const user = (await User_1.default.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        userType,
        address: {
            city: address.city,
            area: address.area,
            colony: address.colony,
            coordinates: {
                lat: address.coordinates.lat,
                lng: address.coordinates.lng,
            },
        },
    }));
    // Generate JWT token
    const token = generateToken(user._id.toString());
    // Prepare the user response
    const userResponse = {
        _id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email || "unknown@example.com", // Provide a default value or handle undefined
        userType: user.userType,
        address: user.address,
    };
    return { user: userResponse, token };
};
exports.register = register;
// Login an existing user
const login = async (credentials) => {
    const { email, password } = credentials;
    // Find the user by email
    const user = (await User_1.default.findOne({ email }).select("+password"));
    if (!user) {
        throw new Error("Invalid email or password");
    }
    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid email or password");
    }
    // Generate JWT token
    const token = generateToken(user._id.toString());
    // Prepare the user response
    const userResponse = {
        _id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email || "unknown@example.com",
        userType: user.userType,
        address: user.address,
    };
    return { user: userResponse, token };
};
exports.login = login;
// Get the current logged-in user
const getCurrentUser = async (userId) => {
    // Find the user by ID
    const user = (await User_1.default.findById(userId));
    if (!user) {
        throw new Error("User not found");
    }
    // Prepare the user response
    const userResponse = {
        _id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email || "unknown@example.com",
        userType: user.userType,
        address: user.address,
    };
    return userResponse;
};
exports.getCurrentUser = getCurrentUser;
