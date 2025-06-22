import express from "express";
import {
  check,
  getme,
  login,
  logout,
  protect,
  signup,
  updatPassword,
  uploadPhoto,
} from "../controllers/autCountroller.js";
import { uploadProfile } from "../lib/cloudinaryProfile.js";

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(protect, logout);
router.route("/updatepassword").patch(protect, updatPassword);
router.route("/uploadprofile").post(protect, uploadProfile, uploadPhoto);

router.route("/getme").get(protect, getme);
router.route("/check").get(protect, check);
export default router;
