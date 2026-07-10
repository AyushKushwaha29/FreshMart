import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import { initSocket } from "./socket.js";
import app from "./app.js";
import connectDB from "./config/db.js";
import ensureAdminUser from "./utils/bootstrapAdmin.js";
import dns from "dns";



dns.lookup("smtp.gmail.com", { family: 4 }, (err, address) => {
  console.log("DNS:", err, address);
});


console.log("Mongo URI:", process.env.MONGODB_URI);

const port = Number(process.env.PORT) || 5000;

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin:
      process.env.CLIENT_URL?.split(",").map((url) => url.trim()) || [
        "http://localhost:5173"
      ],
    credentials: true
  }
});
initSocket(io);
io.on("connection", (socket) => {
  console.log("🟢 Socket Connected:", socket.id);

  socket.on("join-admin", () => {
    socket.join("admins");
    console.log("👑 Admin Joined");
  });

  socket.on("join-user", (userId) => {
    socket.join(`user-${userId}`);
    console.log(`👤 User Joined: ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket Disconnected:", socket.id);
  });
});

const bootstrap = async () => {
  await connectDB();
  await ensureAdminUser();

  server.listen(port, () => {
    console.log(`🚀 FreshMart API listening on port ${port}`);
  });
};

bootstrap().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});