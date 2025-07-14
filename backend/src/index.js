import express from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

// Routes
import authRoute from "./routers/autRoute.js";
import userRoute from "./routers/userRoute.js";
import postRoute from "./routers/postRoute.js";
import notiRoute from "./routers/notificationRoute.js";
import reelRoute from "./routers/reelRoute.js";
import MessageRoute from "./routers/messageRoute.js";
import channalRoute from "./routers/channalRoute.js";
import channelMessageRoute from "./routers/channelMessageRoute.js";
import groupMessageRoute from "./routers/groupMessageRoute.js";
import groupRoute from "./routers/groupRoute.js";
import orderRoute from "./routers/orderRoute.js";
import bookingRoute from "./routers/bookingRoute.js";

// Socket
import { app, server } from "./lib/socket.js";

config(); // Load .env

// 🔒 Required for cookies over HTTPS (Render, etc.)
app.set("trust proxy", 1);

// 📦 Parse JSON and cookies
app.use(express.json());
app.use(cookieParser());

// 🔐 CORS Setup (must come before routes)
app.use(
  cors({
    origin: process.env.FRONT_END_URL, // e.g., https://bdu-connect-frontend.vercel.app
    credentials: true, // Enable cookies
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🧩 MongoDB Connect
mongoose
  .connect(process.env.DATABASE_LOCAL)
  .then(() => {
    console.log("✅ Database connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// 🚀 API Routes
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/post", postRoute);
app.use("/api/notification", notiRoute);
app.use("/api/reel", reelRoute);
app.use("/api/message", MessageRoute);
app.use("/api/channal", channalRoute);
app.use("/api/channelmessage", channelMessageRoute);
app.use("/api/group", groupRoute);
app.use("/api/groupmessage", groupMessageRoute);
app.use("/api/order", orderRoute);
app.use("/api/booking", bookingRoute);

// 🖥️ Start Server
server.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
