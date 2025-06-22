import express from "express";
import { protect } from "../controllers/autCountroller.js";
import {
  createGroup,
  deleteGroup,
  getAllGroup,
  getGroup,
  groupProfile,
  JoinedGroup,
  joinGroup,
  leaveGroup,
  MyGroup,
  updateGroupInfo,
} from "../controllers/groupCountroller.js";
import { uploadChannalProfile } from "../lib/cloudinaryChannall.js";

const router = express.Router();
router.route("/create").post(protect, createGroup);
router.route("/join/:groupId").put(protect, joinGroup);
router.route("/leave/:groupId").put(protect, leaveGroup);
router.route("/delete/:groupId").delete(protect, deleteGroup);
router
  .route("/uploadphoto/:groupId")
  .patch(protect, uploadChannalProfile, groupProfile);
router.route("/mygroup").get(protect, MyGroup);
router.route("/joingroup").get(protect, JoinedGroup);
router.route("/getgroup/:groupId").get(protect, getGroup);
router.route("/getgroups").get(protect, getAllGroup);
router.route("/update/:groupId").patch(protect, updateGroupInfo);

export default router;
