import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONT_END_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

export function getReceverSocketId(userId) {
  return useSocketMap[userId];
}
const useSocketMap = {};

io.on("connection", (socket) => {
  console.log("connection is made", socket.id);
  const userId = socket.handshake.query.userId;

  if (userId) {
    useSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUser", Object.keys(useSocketMap));

  socket.on("disconnect", () => {
    delete useSocketMap[userId];
    io.emit("getOnlineUser", Object.keys(useSocketMap));
  });
});

export { io, app, server };
