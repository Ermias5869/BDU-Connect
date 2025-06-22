import express from "express";
import { protect } from "../controllers/autCountroller.js";
import {
  commentReel,
  createReel,
  deleteComment,
  deleteReel,
  getAllVideos,
  getFollowingsVideo,
  getMyVideos,
  getUserVedios,
  getVideo,
  likedVideos,
  likeUnlikeReel,
  updatecomment,
  userLikedVideos,
} from "../controllers/reelCountroler.js";
import upload from "../lib/upload.js";

const router = express.Router();
router.route("/create").post(protect, upload.single("video"), createReel);
router.route("/delete/:id").delete(protect, deleteReel);
router.route("/like/:id").put(protect, likeUnlikeReel);
router.route("/comment/:id").post(protect, commentReel);
router.route("/deletecomment/:id/:commentId").delete(protect, deleteComment);
router.route("/updatecomment/:id/:commentId").put(protect, updatecomment);
router.route("/getallvideo").get(protect, getAllVideos);
router.route("/getvideo/:id").get(protect, getVideo);
router.route("/getmyvideo").get(protect, getMyVideos);
router.route("/followingsvideo").get(protect, getFollowingsVideo);
router.route("/user/:studId").get(protect, getUserVedios);
router.route("/likedVideos/:studId").get(protect, likedVideos);
router.route("/liked/:studId").get(protect, userLikedVideos);
export default router;
