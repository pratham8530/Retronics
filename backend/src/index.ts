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
import chatRoutes from "./routes/chatRoutes";
import { initializeSocket } from "./services/socketManager";
import { Server } from "socket.io";
import http from "http";
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
app.use("/api/chat", chatRoutes);
// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const server = http.createServer(app);

const io = new Server(server, {
  // Add the 'path' option here
  path: "/socket.io/", // This explicitly tells the server to listen on this path
  cors: {
    origin: "*", // Be more specific in production
    methods: ["GET", "POST"],
  },
});

// Initialize all Socket.IO event listeners
initializeSocket(io);

// --- Server Listening Logic ---
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log("Socket.IO is attached and listening for connections.");
});