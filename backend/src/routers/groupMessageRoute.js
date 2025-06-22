import express from "express";
const router = express.Router();
import { protect } from "../controllers/autCountroller.js";
import { uploadMulter } from "../lib/cloudinaryMessageChannal.js";
import {
  addReaction,
  deleteMessage,
  dislikeUndislikeGroupMessage,
  EditMessage,
  likeUnlikeGroupMessage,
  message,
  sendGroupMessage,
  sendReply,
} from "../controllers/groupMessageController.js";
router.route("/send/:groupId").post(protect, uploadMulter, sendGroupMessage);
router.route("/delete/:messageId").delete(protect, deleteMessage);
router.route("/like/:messageId").patch(protect, likeUnlikeGroupMessage);
router
  .route("/dislike/:messageId")
  .patch(protect, dislikeUndislikeGroupMessage);
router.route("/replay/:messageId").post(protect, sendReply);
router.route("/getmessage/:groupId").get(protect, message);
router.route("/edit/:id").put(protect, EditMessage);

router.route("/message/:messageId/reaction").post(protect, addReaction);

export default router;
