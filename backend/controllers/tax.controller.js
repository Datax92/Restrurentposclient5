const Tax = require("../models/tax.model");

const createTax = async (req, res) => {
    try {
        const { name, rate } = req.body;
        const tax = await Tax.create({ name, rate });
        res.status(201).json({ success: true, message: "Tax created", tax });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getTaxes = async (req, res) => {
    try {
        const taxes = await Tax.find();
        res.status(200).json({ success: true, taxes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateTax = async (req, res) => {
    try {
        const { id } = req.params;
        const tax = await Tax.findByIdAndUpdate(id, req.body, { new: true });
        if (!tax) return res.status(404).json({ success: false, message: "Tax not found" });
        res.status(200).json({ success: true, message: "Tax updated", tax });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteTax = async (req, res) => {
    try {
        const { id } = req.params;
        const tax = await Tax.findByIdAndDelete(id);
        if (!tax) return res.status(404).json({ success: false, message: "Tax not found" });
        res.status(200).json({ success: true, message: "Tax deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createTax, getTaxes, updateTax, deleteTax };
