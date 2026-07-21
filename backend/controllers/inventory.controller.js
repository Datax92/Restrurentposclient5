const Inventory = require("../models/inventory.model");

// Add new stock item
const addStockItem = async (req, res) => {
    try {
        const { name, category, quantity, unit, reorderLevel, supplier, costPerUnit } = req.body;

        const newItem = new Inventory({
            name,
            category,
            quantity,
            unit,
            reorderLevel,
            supplier,
            costPerUnit
        });

        await newItem.save();
        res.status(201).json({ success: true, data: newItem });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get all inventory items
const getInventory = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const totalItems = await Inventory.countDocuments();
        const items = await Inventory.find()
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            data: items,
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

// Update stock quantity or details
const updateStock = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (updateData.quantity !== undefined) {
            updateData.lastRestocked = Date.now();
        }

        const updatedItem = await Inventory.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        if (!updatedItem) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        res.status(200).json({ success: true, data: updatedItem });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete stock item
const deleteStockItem = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedItem = await Inventory.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        res.status(200).json({ success: true, message: "Item deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get stock reports
const getStockReports = async (req, res) => {
    try {
        const allItems = await Inventory.find();

        const lowStockItems = allItems.filter(item => item.quantity <= item.reorderLevel);
        const totalValue = allItems.reduce((acc, item) => acc + (item.quantity * (item.costPerUnit || 0)), 0);

        const stats = {
            totalItems: allItems.length,
            lowStockCount: lowStockItems.length,
            totalValue,
            lowStockItems
        };

        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    addStockItem,
    getInventory,
    updateStock,
    deleteStockItem,
    getStockReports
};
