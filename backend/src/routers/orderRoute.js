import express from "express";
import {
  getOrder,
  getOrders,
  importOrder,
  order1,
  order2,
  updateIsAvailable,
} from "../controllers/orderController.js";
const router = express.Router();

router.route("/getorders").get(getOrders);
router.route("/order1").get(order1);
router.route("/order2").get(order2);
router.route("/import").post(importOrder);
router.route("/getorder/:id").get(getOrder);
router.route("/update-isavaliable/:id").patch(updateIsAvailable);
export default router;
