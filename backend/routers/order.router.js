const express = require("express");
const router = express.Router();
const {
    createOrder, getAllOrders, getOrderById, getOrderStats,
    updateOrderStatus, getKitchenOrders,
    placePublicOrder, trackOrder
} = require("../controllers/order.controller");
const { protectedRoute } = require("../middlewares/auth.middleware");
const { createOrderValidator, updateStatusValidator } = require("../middlewares/validators/order.validator");
const validate = require("../middlewares/validators/validate.middleware");

// ── PUBLIC routes (no auth) ───────────────────────────────────────────────────
router.post("/public", placePublicOrder);            // Customer places order from web
router.get("/track/:orderId", trackOrder);           // Customer tracks their order

// ── Protected routes ─────────────────────────────────────────────────────────
router.use(protectedRoute);

router.post("/", createOrderValidator, validate, createOrder);
router.get("/", getAllOrders);
router.get("/kitchen", getKitchenOrders);
router.get("/stats", getOrderStats);
router.patch("/:id/status", updateStatusValidator, validate, updateOrderStatus);
router.get("/:id", getOrderById);

module.exports = router;
