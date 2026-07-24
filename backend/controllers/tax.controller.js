const Tax = require("../models/tax.model");
const ApiError = require("../utils/ApiError");

const createTax = async (req, res, next) => {
    try {
        const { name, rate } = req.body;
        const tax = await Tax.create({ name, rate });
        res.status(201).json({ success: true, message: "Tax created", tax });
    } catch (error) {
        next(error);
    }
};

const getTaxes = async (req, res, next) => {
    try {
        const taxes = await Tax.find();
        res.status(200).json({ success: true, taxes });
    } catch (error) {
        next(error);
    }
};

const updateTax = async (req, res, next) => {
    try {
        const { id } = req.params;
        const tax = await Tax.findByIdAndUpdate(id, req.body, { new: true });
        if (!tax) throw new ApiError(404, "Tax not found");
        res.status(200).json({ success: true, message: "Tax updated", tax });
    } catch (error) {
        next(error);
    }
};

const deleteTax = async (req, res, next) => {
    try {
        const { id } = req.params;
        const tax = await Tax.findByIdAndDelete(id);
        if (!tax) throw new ApiError(404, "Tax not found");
        res.status(200).json({ success: true, message: "Tax deleted" });
    } catch (error) {
        next(error);
    }
};

module.exports = { createTax, getTaxes, updateTax, deleteTax };
