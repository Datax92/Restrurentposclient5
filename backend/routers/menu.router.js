const express = require("express");
const router = express.Router();
const {
    createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory,
    createMenuItem, getAllMenuItems, getMenuItemById, updateMenuItem, deleteMenuItem
} = require("../controllers/menu.controller");
const { protectedRoute, isAdmin } = require("../middlewares/auth.middleware");
const { validateCategory, validateMenuItem } = require("../middlewares/validators/menu.validator");

const { cacheMiddleware } = require("../middlewares/cache.middleware");

// --- Category Routes ---
router.post(["/category", "/categories"], protectedRoute, isAdmin, validateCategory, createCategory);
router.get(["/category", "/categories"], cacheMiddleware(3600), getAllCategories);
router.get(["/category/:id", "/categories/:id"], getCategoryById);
router.put(["/category/:id", "/categories/:id"], protectedRoute, isAdmin, updateCategory);
router.delete(["/category/:id", "/categories/:id"], protectedRoute, isAdmin, deleteCategory);

// --- Menu Item Routes ---
router.post(["/item", "/items"], protectedRoute, isAdmin, validateMenuItem, createMenuItem);
router.get(["/item", "/items"], cacheMiddleware(3600), getAllMenuItems);
router.get(["/item/:id", "/items/:id"], getMenuItemById);
router.put(["/item/:id", "/items/:id"], protectedRoute, isAdmin, updateMenuItem);
router.delete(["/item/:id", "/items/:id"], protectedRoute, isAdmin, deleteMenuItem);

module.exports = router;
