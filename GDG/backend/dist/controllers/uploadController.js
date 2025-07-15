"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const uploadCloudinary_1 = __importDefault(require("../uploadCloudinary"));
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
const GEMINI_API_KEY = 'AIzaSyDLG3ObQNfMpftULAT43lLkBQtmUnwZnqs';
const encodeImage = (imagePath) => {
    try {
        return fs_1.default.readFileSync(imagePath, { encoding: "base64" });
    }
    catch (error) {
        console.error(`Error reading image file: ${imagePath}`, error);
        throw error;
    }
};
const getGeminiGrading = async (imagePath) => {
    var _a, _b, _c, _d;
    const encodedImage = encodeImage(imagePath);
    const mimeType = "image/png";
    const prompt = `Analyze this image and provide the following details in this exact format:
    **Title:** [Name of the item]
    **Description:** [Brief description of the item in max 15 words]
    **Grade (A-E):** [A/B/C/D/E based on condition (gust a single letter)]`;
    try {
        const response = await axios_1.default.post(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            contents: [
                { role: "user", parts: [{ text: prompt }] },
                { role: "user", parts: [{ inline_data: { mime_type: mimeType, data: encodedImage } }] }
            ]
        });
        const rawResponse = ((_d = (_c = (_b = (_a = response.data.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content.parts) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.text) || "";
        const titleMatch = rawResponse.match(/\*\*Title:\*\*\s*(.*)/);
        const descriptionMatch = rawResponse.match(/\*\*Description:\*\*\s*(.*)/);
        const gradeMatch = rawResponse.match(/\*\*Grade \(A-E\):\*\*\s*(.*)/);
        return {
            itemName: titleMatch ? titleMatch[1].trim() : "Unknown",
            description: descriptionMatch ? descriptionMatch[1].trim() : "No description available",
            grade: gradeMatch ? gradeMatch[1].trim() : "Unknown"
        };
    }
    catch (error) {
        console.error("Error generating description:", error);
        throw error;
    }
};
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ success: false, message: "No file uploaded" });
            return;
        }
        // Get grading from Gemini first
        const grading = await getGeminiGrading(req.file.path);
        // Upload the file to Cloudinary
        const result = await uploadCloudinary_1.default.uploader.upload(req.file.path, {
            folder: "seller-listings",
        });
        // Delete the file from the local uploads folder
        fs_1.default.unlink(req.file.path, (err) => {
            if (err)
                console.error("Error deleting file:", err);
        });
        // Return the correct response
        res.status(200).json({
            success: true,
            item: grading.itemName,
            description: grading.description,
            grade: grading.grade,
            url: result.secure_url
        });
    }
    catch (error) {
        console.error("Error in upload process:", error);
        res.status(500).json({
            success: false,
            message: "Image processing and upload failed"
        });
    }
};
exports.uploadImage = uploadImage;
