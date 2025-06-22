import express from "express";
import {
  followUnfollowUser,
  getUserProfile,
  likedPosts,
  suggestUsers,
  updateMe,
  userLikedPosts,
} from "../controllers/userCountroller.js";
import { protect } from "../controllers/autCountroller.js";
const router = express.Router();

router.route("/getuserprofile/:studId").get(getUserProfile);
router.route("/follow/:id").post(protect, followUnfollowUser);
router.route("/suggestUsers").get(protect, suggestUsers);
router.route("/updateme").patch(protect, updateMe);
router.route("/likedPosts/:studId").get(protect, likedPosts);
router.route("/liked/:id").get(protect, userLikedPosts);

export default router;
