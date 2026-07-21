const express = require("express");
const router = express.Router();
const {
    addStockItem,
    getInventory,
    updateStock,
    deleteStockItem,
    getStockReports
} = require("../controllers/inventory.controller");

router.get("/", getInventory);
router.post("/", addStockItem);
router.put("/:id", updateStock);
router.delete("/:id", deleteStockItem);
router.get("/reports", getStockReports);

module.exports = router;
