import express from "express";
import { protect } from "../controllers/autCountroller.js";
import {
  deleteMessage,
  getFollowedUsersWithLastMessage,
  markMessageAsRead,
  message,
  sendMessage,
  sendReply,
  updateText,
} from "../controllers/messageCountroller.js";

const router = express.Router();
router.route("/user").get(protect, getFollowedUsersWithLastMessage);
router.route("/send/:id").post(protect, sendMessage);
router.route("/getmessage/:id").get(protect, message);
router.route("/delete/:id").delete(protect, deleteMessage);
router.route("/updatetext/:id").patch(protect, updateText);
router.route("/replay/:id").post(protect, sendReply);
router.route("/isRead/id").post(protect, markMessageAsRead);

export default router;
