import express, { Router } from "express";
import {
  ChannalProfile,
  createChannal,
  deleteChannel,
  getAllChannel,
  getChannel,
  getCommenChannel,
  joinChannel,
  JoinedChannal,
  leaveChannel,
  MyChannal,
  updateChannalInfo,
} from "../controllers/channalCountroller.js";
import { protect } from "../controllers/autCountroller.js";
import { uploadChannalProfile } from "../lib/cloudinaryChannall.js";
const router = express.Router();
router.route("/create").post(protect, createChannal);
router.route("/join/:channelId").put(protect, joinChannel);
router.route("/leave/:channelId").put(protect, leaveChannel);
router.route("/delete/:channelId").delete(protect, deleteChannel);
router
  .route("/uploadphoto/:channelId")
  .patch(protect, uploadChannalProfile, ChannalProfile);
router.route("/mychannel").get(protect, MyChannal);
router.route("/joinchannel").get(protect, JoinedChannal);
router.route("/getchannel/:channalId").get(protect, getChannel);
router.route("/getchannels").get(protect, getAllChannel);
router.route("/commenchannels").get(protect, getCommenChannel);
router.route("/update/:channelId").patch(protect, updateChannalInfo);

export default router;
