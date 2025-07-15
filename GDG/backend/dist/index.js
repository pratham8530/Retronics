"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const listingRoutes_1 = __importDefault(require("./routes/listingRoutes"));
const recyclingRoutes_1 = __importDefault(require("./routes/recyclingRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes")); // Import userRoutes
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const dotenv_1 = __importDefault(require("dotenv"));
const requestRoutes_1 = __importDefault(require("./routes/requestRoutes"));
const scheduleScrapUpdate_1 = require("./services/scheduleScrapUpdate");
const pickupRoutes_1 = __importDefault(require("./routes/pickupRoutes"));
dotenv_1.default.config();
// Connect to MongoDB
(0, db_1.default)();
(0, scheduleScrapUpdate_1.scheduleScrapUpdateJob)();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({ origin: '*' }));
app.use(express_1.default.json());
// Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});
app.use('/api/auth', authRoutes_1.default);
app.use('/api/listings', listingRoutes_1.default);
app.use('/api/recycling', recyclingRoutes_1.default);
app.use('/api/users', userRoutes_1.default); // Use userRoutes
app.use('/api/requests', requestRoutes_1.default);
app.use("/api/uploads", uploadRoutes_1.default);
app.use("/api/pickups", pickupRoutes_1.default);
// Error handling middleware
app.use(errorMiddleware_1.notFound);
app.use(errorMiddleware_1.errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
