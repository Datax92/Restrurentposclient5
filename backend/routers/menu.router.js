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
// Use upload middleware to handle multipart/form-data. This populates req.body with text fields and req.file with the image.
router.post("/category", protectedRoute, isAdmin, validateCategory, createCategory);
router.get("/category", cacheMiddleware(3600), getAllCategories);
router.get("/category/:id", getCategoryById);
router.put("/category/:id", protectedRoute, isAdmin, updateCategory);
router.delete("/category/:id", protectedRoute, isAdmin, deleteCategory);

// --- Menu Item Routes ---
router.post("/item", protectedRoute, isAdmin, validateMenuItem, createMenuItem);
router.get("/item", cacheMiddleware(3600), getAllMenuItems);
router.get("/item/:id", getMenuItemById);
router.put("/item/:id", protectedRoute, isAdmin, updateMenuItem);
router.delete("/item/:id", protectedRoute, isAdmin, deleteMenuItem);

module.exports = router;
