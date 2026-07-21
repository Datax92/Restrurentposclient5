const express = require("express");
const router = express.Router();
const clientController = require("../controllers/client.controller");
const { protectedRoute, isAdmin } = require("../middlewares/auth.middleware");

router.get("/", protectedRoute, isAdmin, clientController.getAllClients);
router.get("/:id/history", protectedRoute, isAdmin, clientController.getClientHistory);
router.delete("/:id", protectedRoute, isAdmin, clientController.deleteClient);

module.exports = router;
