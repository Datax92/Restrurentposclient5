const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report.controller");

router.get("/sales", reportController.getSalesReports);
router.get("/cashier-collections", reportController.getCashierCollections);
router.get("/top-selling", reportController.getTopSellingItems);
router.get("/profit-loss", reportController.getProfitLoss);

module.exports = router;
