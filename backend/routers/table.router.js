const express = require("express");
const router = express.Router();
const { createTable, getTables, updateTable, deleteTable, reserveTable, cancelReservation } = require("../controllers/table.controller");
const { protectedRoute, isAdmin } = require("../middlewares/auth.middleware");

// All routes protected by Auth and Admin (for now)
router.use(protectedRoute);

router.get("/", getTables); // Waiters might need this later, but protected for now
router.post("/", isAdmin, createTable);
router.put("/:id", isAdmin, updateTable);
router.delete("/:id", isAdmin, deleteTable);
router.post("/:id/reserve", isAdmin, reserveTable);
router.post("/:id/cancel-reservation", isAdmin, cancelReservation);

module.exports = router;
