const express = require("express");
const router = express.Router();
const { createDiscount, getDiscounts, updateDiscount, deleteDiscount } = require("../controllers/discount.controller");
const { protectedRoute, isAdmin } = require("../middlewares/auth.middleware");

// All routes protected by Auth and Admin
router.use(protectedRoute, isAdmin);

router.post("/", createDiscount);
router.get("/", getDiscounts);
router.put("/:id", updateDiscount);
router.delete("/:id", deleteDiscount);

module.exports = router;
