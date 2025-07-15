"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
// Fetch sellers with their listings
router.get('/sellers-with-listings', userController_1.getSellersWithListings);
exports.default = router;
