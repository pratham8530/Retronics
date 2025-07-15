import express from 'express';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import listingRoutes from './routes/listingRoutes';
import recyclingRoutes from './routes/recyclingRoutes';
import userRoutes from './routes/userRoutes'; // Import userRoutes
import uploadRoutes from "./routes/uploadRoutes";
import { notFound, errorHandler } from './middleware/errorMiddleware';
import dotenv from 'dotenv';
import requestRoutes from './routes/requestRoutes';
import { scheduleScrapUpdateJob } from './services/scheduleScrapUpdate';
import pickupRoutes from "./routes/pickupRoutes";
dotenv.config();

// Connect to MongoDB
connectDB();
scheduleScrapUpdateJob();
const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/recycling', recyclingRoutes);
app.use('/api/users', userRoutes); // Use userRoutes
app.use('/api/requests', requestRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/pickups", pickupRoutes);
// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});