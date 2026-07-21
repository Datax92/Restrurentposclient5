const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Category name is required"],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    }
}, { timestamps: true });

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Item name is required"],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Category is required"]
    },
    costPrice: {
        type: Number,
        default: 0,
        min: 0
    },
    image: {
        type: String,
        default: ""
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    isVeg: {
        type: Boolean,
        default: true // true for Veg, false for Non-Veg (can be expanded to enum if needed)
    },
    spiceLevel: {
        type: String,
        enum: ["mild", "medium", "hot", "extra_hot"],
        default: "medium"
    },
    preparationTime: {
        type: Number, // in minutes
        default: 15
    },
    variants: [{
        name: { type: String, required: true }, // e.g., "Small", "Regular"
        price: { type: Number, required: true }
    }],
    taxes: {
        type: Number, // Percentage value, e.g., 5 for 5%
        default: 0
    }
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
const MenuItem = mongoose.models.MenuItem || mongoose.model("MenuItem", menuItemSchema);

module.exports = { Category, MenuItem };
