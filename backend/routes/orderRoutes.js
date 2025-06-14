const express = require("express");
const {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
} = require("../controllers/orderController");
const { verifyToken } = require("../middlewares/verifyToken");

const router = express.Router();

router.post("/", verifyToken, placeOrder);
router.get("/my-orders", verifyToken, getUserOrders);
router.get("/", verifyToken, getAllOrders);
router.put("/:id/status", verifyToken, updateOrderStatus);

module.exports = router;
