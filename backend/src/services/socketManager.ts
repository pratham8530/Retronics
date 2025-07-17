import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import Message from "../models/Message"; // Adjust path if needed

export const initializeSocket = (io: Server) => {
  // Middleware is fine, no changes needed here
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication error: Token not provided"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      (socket as any).user = decoded;
      next();
    } catch (err) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  // Main connection handler
  io.on("connection", (socket: Socket) => {
    console.log(`✅ Real-time connection established: ${socket.id}`);

    // This listener is fine, no changes needed
    socket.on("join_room", (conversationId: string) => {
      socket.join(conversationId);
      console.log(`User ${socket.id} joined private room: ${conversationId}`);
    });

    // Event Listener for receiving and broadcasting a message
    socket.on("send_message", async (data) => {
      const { conversationId, senderId, text } = data;

      if (!conversationId || !senderId || !text) {
        console.error("Socket Error: Invalid message data received:", data);
        socket.emit("error", { message: "Invalid message data." });
        return;
      }

      try {
        const newMessage = new Message({
          conversationId,
          sender: senderId,
          text,
        });
        const savedMessage = await newMessage.save();
        const messageToBroadcast = await savedMessage.populate(
          "sender",
          "_id firstName"
        );

        // MODIFIED: This is the critical change.
        // Change `io.to` to `socket.broadcast.to` to send to everyone *except* the sender.
        socket.broadcast
          .to(conversationId)
          .emit("receive_message", messageToBroadcast);

        console.log(
          `Message broadcast to room ${conversationId} (excluding sender)`
        );
      } catch (error) {
        console.error(
          "Socket Error: Failed to save or broadcast message.",
          error
        );
        socket.emit("error", { message: "Failed to send message." });
      }
    });

    // This listener is fine, no changes needed
    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });
};