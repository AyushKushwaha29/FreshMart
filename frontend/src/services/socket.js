import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_API_BASE ||
  "http://localhost:5000";

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000
});