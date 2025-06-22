import express, { Router } from "express";
import {
  commentPost,
  createPost,
  deleteComment,
  deletePost,
  getAllPosts,
  getFollowingsPost,
  getMyPosts,
  getPost,
  getUserPosts,
  likeUnlikePost,
  updatecomment,
} from "../controllers/postCountroller.js";
import { protect } from "../controllers/autCountroller.js";
import { uploadMulter } from "../lib/cloudinaryConfig.js";
const router = express.Router();
router.route("/create").post(protect, uploadMulter, createPost);
router.route("/delete/:id").delete(protect, deletePost);
router.route("/like/:id").put(protect, likeUnlikePost);
router.route("/comment/:id").post(protect, commentPost);
router.route("/deletecomment/:id/:commentId").delete(protect, deleteComment);
router.route("/updatecomment/:id/:commentId").put(protect, updatecomment);
router.route("/getallpost").get(protect, getAllPosts);
router.route("/getpost/:id").get(protect, getPost);
router.route("/getmypost").get(protect, getMyPosts);
router.route("/followingspost").get(protect, getFollowingsPost);
router.route("/user/:id").get(protect, getUserPosts);

export default router;
