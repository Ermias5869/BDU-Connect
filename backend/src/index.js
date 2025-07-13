import express from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
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
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";
config();

app.use(express.json());
app.use(cookieParser());
//frontend uri
app.use(
  cors({
    origin: process.env.FRONT_END_URL,
    credentials: true,
    methods: "GET,POST,PUT,DELETE,PATCH",
    allowedHeaders: "Content-Type,Authorization",
  })
);
mongoose.connect(process.env.DATABASE_LOCAL).then(() => {
  console.log("Databae is connected");
});

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

server.listen(process.env.PORT, () => {
  console.log(`server is run on port ${process.env.PORT}`);
});
