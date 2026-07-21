const Discount = require("../models/discount.model");

const createDiscount = async (req, res) => {
    try {
        const { name, type, value, startDate, endDate } = req.body;
        const discount = await Discount.create({ name, type, value, startDate, endDate });
        res.status(201).json({ success: true, message: "Discount created", discount });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getDiscounts = async (req, res) => {
    try {
        const discounts = await Discount.find();
        res.status(200).json({ success: true, discounts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateDiscount = async (req, res) => {
    try {
        const { id } = req.params;
        const discount = await Discount.findByIdAndUpdate(id, req.body, { new: true });
        if (!discount) return res.status(404).json({ success: false, message: "Discount not found" });
        res.status(200).json({ success: true, message: "Discount updated", discount });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteDiscount = async (req, res) => {
    try {
        const { id } = req.params;
        const discount = await Discount.findByIdAndDelete(id);
        if (!discount) return res.status(404).json({ success: false, message: "Discount not found" });
        res.status(200).json({ success: true, message: "Discount deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createDiscount, getDiscounts, updateDiscount, deleteDiscount };
