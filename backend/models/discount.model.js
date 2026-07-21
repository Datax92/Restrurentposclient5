const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Discount name is required"],
        trim: true
    },
    type: {
        type: String,
        enum: ["Percentage", "Fixed Amount"],
        required: [true, "Discount type is required"]
    },
    value: {
        type: Number,
        required: [true, "Discount value is required"],
        min: 0
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Discount = mongoose.models.Discount || mongoose.model("Discount", discountSchema);
module.exports = Discount;
