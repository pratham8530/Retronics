import dotenv from "dotenv";
dotenv.config(); // Load environment variables

const bcrypt: any = require("bcryptjs");
import jwt from "jsonwebtoken";
import User, { UserDocument } from "../models/User";
import { ILoginRequest, IRegisterRequest, IUserResponse } from "../types";

const JWT_SECRET = process.env.JWT_SECRET || "fallbackSecretKey";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "86400"; // Default to 24 hours

console.log("JWT_SECRET:", JWT_SECRET ? "Loaded" : "Not Loaded"); // Debugging

// Helper function to generate JWT token
const generateToken = (userId: string): string => {
    return jwt.sign({ id: userId }, JWT_SECRET, {
        expiresIn: parseInt(JWT_EXPIRES_IN, 10),
    });
};

// Register a new user
export const register = async (userData: IRegisterRequest): Promise<{ user: IUserResponse; token: string }> => {
    const { firstName, lastName, email, password, userType, address } = userData;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("User already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = (await User.create({
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
    })) as UserDocument;

    // Generate JWT token
    const token = generateToken(user._id.toString());

    // Prepare the user response
    const userResponse: IUserResponse = {
        _id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email || "unknown@example.com", // Provide a default value or handle undefined
        userType: user.userType,
        address: user.address,
    };

    return { user: userResponse, token };
};

// Login an existing user
export const login = async (credentials: ILoginRequest): Promise<{ user: IUserResponse; token: string }> => {
    const { email, password } = credentials;

    // Find the user by email
    const user = (await User.findOne({ email }).select("+password")) as UserDocument;
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
    const userResponse: IUserResponse = {
        _id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email || "unknown@example.com",
        userType: user.userType,
        address: user.address,
    };

    return { user: userResponse, token };
};

// Get the current logged-in user
export const getCurrentUser = async (userId: string): Promise<IUserResponse> => {
    // Find the user by ID
    const user = (await User.findById(userId)) as UserDocument;
    if (!user) {
        throw new Error("User not found");
    }

    // Prepare the user response
    const userResponse: IUserResponse = {
        _id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email || "unknown@example.com",
        userType: user.userType,
        address: user.address,
    };

    return userResponse;
};