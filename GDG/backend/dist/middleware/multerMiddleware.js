"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// middleware/multerMiddleware.js
const multer_1 = __importDefault(require("multer"));
// Use memory storage to keep file data in memory
const storage = multer_1.default.memoryStorage();
// File filter to accept only images (you can customize this)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Accept the file
    }
    else {
        cb(null, false); // Reject the file
    }
};
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit (adjust as needed)
    }
});
exports.default = upload;
