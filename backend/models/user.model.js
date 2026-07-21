const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please fill a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    pin: {
        type: String,
        trim: true,
        // Optional: length validation
    },
    role: {
        type: String,
        enum: ["admin", "manager", "cashier", "waiter", "kitchen", "client"],
        default: "client"
    },
    designation: {
        type: String,
        trim: true
    },
    permissions: [{
        type: String
    }],
    shift: {
        start: String,
        end: String
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    avatar: {
        type: String,
        default: ""
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;

