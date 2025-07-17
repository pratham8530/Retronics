import { io } from "socket.io-client";

const URL = "http://localhost:5000";

const token = localStorage.getItem("token");

export const socket = io(URL, {
  autoConnect: false,
  auth: {
    token: token,
  },
  // Add the corresponding 'path' option here
  path: "/socket.io/", // This ensures the client connects to the correct path
});