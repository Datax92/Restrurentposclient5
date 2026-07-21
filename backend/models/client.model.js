const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Client name is required"],
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        // Optional: match regex if strictly needed, but some clients might just have phone
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true
    },
    avatar: {
        type: String,
        default: ""
    },

    // Purchase History
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    }],
    totalSpent: {
        type: Number,
        default: 0
    },
    lastVisit: {
        type: Date,
        default: Date.now
    },

    // Booking History (Simplified reference, or detailed log)
    // Since Table model handles active reservation, this could be a log of past ones
    bookings: [{
        table: { type: mongoose.Schema.Types.ObjectId, ref: "Table" },
        date: { type: Date },
        guests: { type: Number },
        status: {
            type: String,
            enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
            default: "Pending"
        },
        notes: String
    }],

    // Optional: Notes/Preferences
    preferences: {
        type: String,
        trim: true
    },
    address: { // For delivery if needed later
        street: String,
        city: String,
        zip: String
    }

}, { timestamps: true });

const Client = mongoose.models.Client || mongoose.model("Client", clientSchema);
module.exports = Client;
