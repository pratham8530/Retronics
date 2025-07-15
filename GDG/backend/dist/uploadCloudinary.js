"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// config/cloudinary.js (or in your index.js)
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Get from environment variables
    api_key: process.env.CLOUDINARY_API_KEY, // Get from environment variables
    api_secret: process.env.CLOUDINARY_API_SECRET // Get from environment variables
});
exports.default = cloudinary_1.v2;
