const express = require("express");
const router = express.Router();
const {
    createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory,
    createMenuItem, getAllMenuItems, getMenuItemById, updateMenuItem, deleteMenuItem
} = require("../controllers/menu.controller");
const { protectedRoute, isAdmin } = require("../middlewares/auth.middleware");
const { validateCategory, validateMenuItem } = require("../middlewares/validators/menu.validator");

const { cacheMiddleware } = require("../middlewares/cache.middleware");

const handleCategoryOrItemAlias = (req, res, next, handler) => {
    const baseUrl = req.baseUrl || "";

    if (baseUrl.endsWith("/categories")) {
        return handler(req, res, next);
    }

    if (baseUrl.endsWith("/items")) {
        return handler(req, res, next);
    }

    return next();
};

router.route("/")
    .get((req, res, next) => {
        const baseUrl = req.baseUrl || "";
        if (baseUrl.endsWith("/categories")) {
            return getAllCategories(req, res, next);
        }
        if (baseUrl.endsWith("/items")) {
            return getAllMenuItems(req, res, next);
        }
        return next();
    })
    .post((req, res, next) => {
        const baseUrl = req.baseUrl || "";
        if (baseUrl.endsWith("/categories")) {
            return createCategory(req, res, next);
        }
        if (baseUrl.endsWith("/items")) {
            return createMenuItem(req, res, next);
        }
        return next();
    });

// --- Category Routes ---
router.route("/category")
    .post(protectedRoute, isAdmin, validateCategory, createCategory)
    .get(cacheMiddleware(3600), getAllCategories);

router.route("/categories")
    .post(protectedRoute, isAdmin, validateCategory, createCategory)
    .get(cacheMiddleware(3600), getAllCategories);

router.route("/category/:id")
    .get(getCategoryById)
    .put(protectedRoute, isAdmin, updateCategory)
    .delete(protectedRoute, isAdmin, deleteCategory);

router.route("/categories/:id")
    .get(getCategoryById)
    .put(protectedRoute, isAdmin, updateCategory)
    .delete(protectedRoute, isAdmin, deleteCategory);

// --- Menu Item Routes ---
router.route("/item")
    .post(protectedRoute, isAdmin, validateMenuItem, createMenuItem)
    .get(cacheMiddleware(3600), getAllMenuItems);

router.route("/items")
    .post(protectedRoute, isAdmin, validateMenuItem, createMenuItem)
    .get(cacheMiddleware(3600), getAllMenuItems);

router.route("/item/:id")
    .get(getMenuItemById)
    .put(protectedRoute, isAdmin, updateMenuItem)
    .delete(protectedRoute, isAdmin, deleteMenuItem);

router.route("/items/:id")
    .get(getMenuItemById)
    .put(protectedRoute, isAdmin, updateMenuItem)
    .delete(protectedRoute, isAdmin, deleteMenuItem);

module.exports = router;
