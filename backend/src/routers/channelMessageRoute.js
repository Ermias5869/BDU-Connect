import express from "express";
import { protect } from "../controllers/autCountroller.js";
import {
  addReaction,
  commentChannelMessage,
  deleteChannelComment,
  deleteMessage,
  dislikeUndislikeChannelMessage,
  EditMessage,
  likeUnlikeChannelMessage,
  message,
  sendChannelMessage,
  updateChannelComment,
} from "../controllers/chnannelMessageCountroller.js";
import { uploadMulter } from "../lib/cloudinaryMessageChannal.js";

const router = express.Router();
router
  .route("/send/:channelId")
  .post(protect, uploadMulter, sendChannelMessage);
router.route("/delete/:messageId").delete(protect, deleteMessage);
router.route("/like/:messageId").patch(protect, likeUnlikeChannelMessage);
router
  .route("/messages/:messageId/comment")
  .post(protect, commentChannelMessage);
router
  .route("/messages/:messageId/deletecomment/:commentId")
  .delete(protect, deleteChannelComment);
router
  .route("/messages/:messageId/updatecomment/:commentId")
  .put(protect, updateChannelComment);
router
  .route("/dislike/:messageId")
  .patch(protect, dislikeUndislikeChannelMessage);
router.route("/getmessage/:channelId").get(protect, message);
router.route("/edit/:id").put(protect, EditMessage);

router.route("/message/:messageId/reaction").post(protect, addReaction);

export default router;
