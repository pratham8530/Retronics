import { io } from "socket.io-client";

// 1. Get the base URL of your backend server from environment variables.
//    It's crucial to use environment variables for this so you can have
//    different URLs for development and production.
//    The fallback 'http://localhost:8000' is for local development.
const URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// 2. Retrieve the user's authentication token from localStorage.
//    This token will be sent to the server to authenticate the socket connection.
const token = localStorage.getItem("token");

// 3. Create and export the socket instance.
export const socket = io(URL, {
  // 4. `autoConnect: false` is a critical setting.
  //    It prevents the socket from automatically trying to connect when the app loads.
  //    Instead, we will manually call `socket.connect()` inside components
  //    (like the ChatWidget) when we actually need the connection. This is more efficient.
  autoConnect: false,

  // 5. The `auth` object is where we send credentials to the server.
  //    Our backend's Socket.IO middleware will look for this token to verify the user.
  auth: {
    token: token,
  },
});
