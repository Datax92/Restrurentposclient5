const express = require("express");
const router = express.Router();
const { createTax, getTaxes, updateTax, deleteTax } = require("../controllers/tax.controller");
const { protectedRoute, isAdmin } = require("../middlewares/auth.middleware");

// All routes protected by Auth and Admin
router.use(protectedRoute, isAdmin);

router.post("/", createTax);
router.get("/", getTaxes);
router.put("/:id", updateTax);
router.delete("/:id", deleteTax);

module.exports = router;
