import express from "express";
import { protect } from "../controllers/autCountroller.js";
import { getCheckOut } from "../controllers/bookingController.js";

const router = express.Router();

router.route("/checkout/:Id").post(protect, getCheckOut);

export default router;
