const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        unique: true,
        // We'll generate this in the controller (e.g., ORD-timestamp-random)
    },
    type: {
        type: String,
        enum: ["Dine-in", "Takeaway"],
        required: [true, "Order type is required"]
    },
    status: {
        type: String,
        enum: ["Pending", "Preparing", "Ready", "Completed", "Cancelled"],
        default: "Pending"
    },
    paymentMethod: {
        type: String,
        enum: ["Cash", "Card", "Online"],
        default: "Cash"
    },
    items: [{
        menuItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MenuItem",
            required: true
        },
        name: String, // Snapshot of name at time of order
        price: Number, // Snapshot of price at time of order
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    }],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required: [true, "Client is required for the order"]
    },
    clientName: String, // Snapshot for history
    clientPhone: String, // Snapshot for history
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // Staff member who processed the order
    },
    table: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Table",
        // Optional: only for Dine-in
    }
}, { timestamps: true });

// Compound index for optimizing order queries (e.g. fetching 'Pending' orders sorted by newest first)
orderSchema.index({ status: 1, createdAt: -1 });

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
module.exports = Order;
