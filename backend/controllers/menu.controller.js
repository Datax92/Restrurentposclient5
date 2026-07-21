const { Category, MenuItem } = require("../models/menu.model");
const cloudinary = require("../config/cloudinary/cloudinary");
const { clearCache } = require("../middlewares/cache.middleware");
const ApiError = require("../utils/ApiError");

// --- Category Controllers ---

const createCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        const existingCategory = await Category.findOne({ name });
        if (existingCategory) throw new ApiError(400, "Category already exists");

        let image = "";

        if (req.body.image && typeof req.body.image === 'string') {
            const uploadResponse = await cloudinary.uploader.upload(req.body.image, {
                folder: "pos_menu_categories"
            });
            image = uploadResponse.secure_url;
        }

        const category = new Category({ name, description, image });
        const savedCategory = await category.save();

        // Invalidate cache
        await clearCache('cache:/api/menu/category*');

        res.status(201).json({ success: true, category: savedCategory });
    } catch (error) {
        next(error);
    }
};

const getAllCategories = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const totalCategories = await Category.countDocuments();
        const categories = await Category.find()
            .skip(skip)
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            categories,
            pagination: {
                totalCategories,
                totalPages: Math.ceil(totalCategories / limit),
                currentPage: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getCategoryById = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) throw new ApiError(404, "Category not found");
        res.status(200).json({ success: true, category });
    } catch (error) {
        next(error);
    }
};

const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description, status } = req.body;
        let updateData = { name, description, status };

        if (req.body.image && typeof req.body.image === 'string') {
            const uploadResponse = await cloudinary.uploader.upload(req.body.image, {
                folder: "pos_menu_categories"
            });
            updateData.image = uploadResponse.secure_url;
        }

        const updatedCategory = await Category.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedCategory) throw new ApiError(404, "Category not found");

        // Invalidate cache
        await clearCache('cache:/api/menu/category*');

        res.status(200).json({ success: true, message: "Category updated", category: updatedCategory });
    } catch (error) {
        next(error);
    }
};

const deleteCategory = async (req, res, next) => {
    try {
        const id = req.params.id;
        const items = await MenuItem.find({ category: id });
        if (items.length > 0) {
            throw new ApiError(400, "Cannot delete category with associated items. Please delete or reassign items first.");
        }

        const category = await Category.findByIdAndDelete(id);
        if (!category) throw new ApiError(404, "Category not found");

        // Invalidate cache
        await clearCache('cache:/api/menu/category*');

        res.status(200).json({ success: true, message: "Category deleted" });
    } catch (error) {
        next(error);
    }
};

// --- Menu Item Controllers ---

const createMenuItem = async (req, res, next) => {
    try {
        let { name, description, price, category, isAvailable, isVeg, spiceLevel, preparationTime, variants, taxes } = req.body;

        if (typeof variants === 'string') {
            try {
                variants = JSON.parse(variants);
            } catch (e) {
                console.error("Error parsing variants JSON:", e);
                return res.status(400).json({ success: false, message: "Invalid variants format" });
            }
        }

        const existingItem = await MenuItem.findOne({ name });
        if (existingItem) throw new ApiError(400, "Item already exists");

        let image = "";
        if (req.body.image && typeof req.body.image === 'string') {
            const uploadResponse = await cloudinary.uploader.upload(req.body.image, {
                folder: "pos_menu_items"
            });
            image = uploadResponse.secure_url;
        }

        const menuItem = new MenuItem({
            name, description, price, category, image, isAvailable, isVeg, spiceLevel, preparationTime, variants, taxes
        });
        const savedItem = await menuItem.save();

        // Invalidate cache
        await clearCache('cache:/api/menu/item*');

        res.status(201).json({ success: true, menuItem: savedItem });
    } catch (error) {
        next(error);
    }
};

const getAllMenuItems = async (req, res) => {
    try {
        const { category, page = 1, limit = 10, search = "", isAvailable } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        let query = {};

        if (category) {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        if (isAvailable !== undefined && isAvailable !== "") {
            query.isAvailable = isAvailable === 'true';
        }

        const totalItems = await MenuItem.countDocuments(query);
        const menuItems = await MenuItem.find(query)
            .populate('category', 'name')
            .skip(skip)
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            menuItems,
            pagination: {
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getMenuItemById = async (req, res, next) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id).populate('category', 'name');
        if (!menuItem) throw new ApiError(404, "Menu item not found");
        res.status(200).json({ success: true, menuItem });
    } catch (error) {
        next(error);
    }
};

const updateMenuItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        let updateData = { ...req.body };

        if (updateData.variants && typeof updateData.variants === 'string') {
            try {
                updateData.variants = JSON.parse(updateData.variants);
            } catch (_error) {
                return res.status(400).json({ success: false, message: "Invalid variants format" });
            }
        }

        if (req.body.image && typeof req.body.image === 'string') {
            const uploadResponse = await cloudinary.uploader.upload(req.body.image, {
                folder: "pos_menu_items"
            });
            updateData.image = uploadResponse.secure_url;
        }

        const updatedItem = await MenuItem.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedItem) throw new ApiError(404, "Menu item not found");

        // Invalidate cache
        await clearCache('cache:/api/menu/item*');

        res.status(200).json({ success: true, message: "Menu item updated", menuItem: updatedItem });
    } catch (error) {
        next(error);
    }
};

const deleteMenuItem = async (req, res, next) => {
    try {
        const id = req.params.id;
        const menuItem = await MenuItem.findByIdAndDelete(id);
        if (!menuItem) throw new ApiError(404, "Menu item not found");

        // Invalidate cache
        await clearCache('cache:/api/menu/item*');

        res.status(200).json({ success: true, message: "Menu item deleted" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory,
    createMenuItem, getAllMenuItems, getMenuItemById, updateMenuItem, deleteMenuItem
};
