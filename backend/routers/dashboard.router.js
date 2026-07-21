const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");
const { protectedRoute, isAdmin } = require("../middlewares/auth.middleware");

const { cacheMiddleware } = require("../middlewares/cache.middleware");

router.get("/summary", protectedRoute, isAdmin, cacheMiddleware(300), dashboardController.getDashboardOverview);

module.exports = router;
