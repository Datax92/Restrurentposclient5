const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Item name is required"],
        trim: true
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        trim: true
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        default: 0,
        min: 0
    },
    unit: {
        type: String,
        required: [true, "Unit (e.g., kg, pcs) is required"],
        default: "pcs"
    },
    reorderLevel: {
        type: Number,
        default: 10,
        min: 0
    },
    supplier: {
        type: String,
        trim: true
    },
    costPerUnit: {
        type: Number,
        min: 0
    },
    lastRestocked: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Inventory = mongoose.models.Inventory || mongoose.model("Inventory", inventorySchema);
module.exports = Inventory;
