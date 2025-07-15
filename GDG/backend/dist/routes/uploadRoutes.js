"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uploadMiddleware_1 = __importDefault(require("../middleware/uploadMiddleware")); // Multer middleware
const uploadController_1 = require("../controllers/uploadController");
const router = (0, express_1.Router)();
router.post("/upload", uploadMiddleware_1.default.single("image"), uploadController_1.uploadImage);
exports.default = router;
