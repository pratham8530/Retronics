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
exports.getCurrentUser = exports.login = exports.register = void 0;
const authService = __importStar(require("../services/authService"));
// Register controller
const register = async (req, res) => {
    try {
        const userData = req.body;
        console.log('Register request data:', userData);
        const { user, token } = await authService.register(userData);
        res.status(201).json({ user, token }); // Fix: Remove nested "data"
    }
    catch (error) {
        console.error('Error during registration:', error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.register = register;
// Login controller
const login = async (req, res) => {
    try {
        const credentials = req.body;
        console.log('Login request data:', credentials);
        const { user, token } = await authService.login(credentials);
        res.status(200).json({ user, token }); // Fix: Remove nested "data"
    }
    catch (error) {
        console.error('Error during login:', error.message);
        res.status(401).json({ success: false, message: error.message });
    }
};
exports.login = login;
// Get current user controller
const getCurrentUser = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        const user = await authService.getCurrentUser(req.user._id.toString());
        res.status(200).json({ user }); // Fix: Remove nested "data"
    }
    catch (error) {
        console.error('Error getting current user:', error.message);
        res.status(404).json({ success: false, message: error.message });
    }
};
exports.getCurrentUser = getCurrentUser;
