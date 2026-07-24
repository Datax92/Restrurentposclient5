const Discount = require("../models/discount.model");
const ApiError = require("../utils/ApiError");

const createDiscount = async (req, res, next) => {
    try {
        const { name, type, value, startDate, endDate } = req.body;
        const discount = await Discount.create({ name, type, value, startDate, endDate });
        res.status(201).json({ success: true, message: "Discount created", discount });
    } catch (error) {
        next(error);
    }
};

const getDiscounts = async (req, res, next) => {
    try {
        const discounts = await Discount.find();
        res.status(200).json({ success: true, discounts });
    } catch (error) {
        next(error);
    }
};

const updateDiscount = async (req, res, next) => {
    try {
        const { id } = req.params;
        const discount = await Discount.findByIdAndUpdate(id, req.body, { new: true });
        if (!discount) throw new ApiError(404, "Discount not found");
        res.status(200).json({ success: true, message: "Discount updated", discount });
    } catch (error) {
        next(error);
    }
};

const deleteDiscount = async (req, res, next) => {
    try {
        const { id } = req.params;
        const discount = await Discount.findByIdAndDelete(id);
        if (!discount) throw new ApiError(404, "Discount not found");
        res.status(200).json({ success: true, message: "Discount deleted" });
    } catch (error) {
        next(error);
    }
};

module.exports = { createDiscount, getDiscounts, updateDiscount, deleteDiscount };
