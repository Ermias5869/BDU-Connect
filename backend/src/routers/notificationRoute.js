import express from "express";
import { protect } from "../controllers/autCountroller.js";
import {
  deleteAllNotifications,
  deleteNotification,
  getNotifications,
} from "../controllers/notificationControllers.js";
const router = express.Router();
router.route("/").get(protect, getNotifications);
router.route("/:id").delete(protect, deleteNotification);
router.route("/").delete(protect, deleteAllNotifications);

export default router;
