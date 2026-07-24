const User = require("../models/user.model");
const { validationResult } = require("express-validator");
const genrateToken = require("../utils/genrateToken");
const ApiError = require("../utils/ApiError");

const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation Error",
                errors: errors.array()
            });
        }

        const EmailExist = await User.findOne({ email });
        if (EmailExist) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        const user = await User.create({ name, email, password, role });
        genrateToken(user._id, res);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        genrateToken(user._id, res);
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user
        });
    } catch (error) {
        next(error);
    }
};

const getAllStaff = async (req, res, next) => {
    try {
        const staff = await User.find({ role: { $ne: 'client' } }).select('-password');
        res.status(200).json({
            success: true,
            staff
        });
    } catch (error) {
        next(error);
    }
};

const createNewStaff = async (req, res, next) => {
    try {
        const { name, email, password, role, pin, designation, permissions, shift, phoneNumber, avatar } = req.body;
        const EmailExist = await User.findOne({ email });
        if (EmailExist) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        const user = await User.create({
            name, email, password, role, pin, designation, permissions, shift, phoneNumber, avatar
        });

        res.status(201).json({
            success: true,
            message: "Staff created successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive
            }
        });
    } catch (error) {
        next(error);
    }
};

const updateStaff = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        delete updates.password;

        const user = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
        if (!user) {
            throw new ApiError(404, "Staff not found");
        }

        res.status(200).json({
            success: true,
            message: "Staff updated successfully",
            user
        });
    } catch (error) {
        next(error);
    }
};

const toggleStaffStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            throw new ApiError(404, "Staff not found");
        }

        user.isActive = !user.isActive;
        await user.save();

        res.status(200).json({
            success: true,
            message: `Staff ${user.isActive ? 'activated' : 'deactivated'} successfully`,
            isActive: user.isActive
        });
    } catch (error) {
        next(error);
    }
};

const deleteStaff = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            throw new ApiError(404, "Staff not found");
        }

        res.status(200).json({
            success: true,
            message: "Staff deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};


module.exports = { register, login, getAllStaff, createNewStaff, updateStaff, toggleStaffStatus, deleteStaff };