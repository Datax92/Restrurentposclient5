const Table = require("../models/table.model");
const User = require("../models/user.model");
const Client = require("../models/client.model");
const ApiError = require("../utils/ApiError");

const createTable = async (req, res, next) => {
    try {
        const { name, zone, capacity } = req.body;
        const existingTable = await Table.findOne({ name });
        if (existingTable) {
            return res.status(400).json({ success: false, message: "Table already exists" });
        }
        const table = await Table.create({ name, zone, capacity });
        res.status(201).json({ success: true, message: "Table created", table });
    } catch (error) {
        next(error);
    }
};

const getTables = async (req, res, next) => {
    try {
        const tables = await Table.find()
            .populate("person", "name email phoneNumber avatar")
            .populate("client", "name phone email avatar totalSpent");
        res.status(200).json({ success: true, tables });
    } catch (error) {
        next(error);
    }
};

const updateTable = async (req, res, next) => {
    try {
        const { id } = req.params;
        const table = await Table.findByIdAndUpdate(id, req.body, { new: true });
        if (!table) throw new ApiError(404, "Table not found");
        res.status(200).json({ success: true, message: "Table updated", table });
    } catch (error) {
        next(error);
    }
};

const deleteTable = async (req, res, next) => {
    try {
        const { id } = req.params;
        const table = await Table.findByIdAndDelete(id);
        if (!table) throw new ApiError(404, "Table not found");
        res.status(200).json({ success: true, message: "Table deleted" });
    } catch (error) {
        next(error);
    }
};

const reserveTable = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { bookedBy, contact, guests, date, notes } = req.body;

        const table = await Table.findById(id);
        if (!table) throw new ApiError(404, "Table not found");

        if (table.status !== "Available") {
            return res.status(400).json({ success: false, message: `Table is currently ${table.status}` });
        }

        table.status = "Reserved";
        table.reservation = { bookedBy, contact, guests, date, notes };

        let client = await Client.findOne({ phone: contact });

        if (!client) {
            // Create new client if not exists
            client = await Client.create({
                name: bookedBy,
                phone: contact,
                bookings: []
            });
        }

        // Add booking to client history
        client.bookings.push({
            table: table._id,
            date: date || new Date(),
            guests: guests,
            status: "Confirmed",
            notes: notes
        });
        client.lastVisit = new Date();
        await client.save();

        table.client = client._id;

        // precise user linking if userId provided
        if (req.body.userId) {
            const user = await User.findById(req.body.userId);
            if (user) {
                table.person = user._id;
            }
        }

        await table.save();

        res.status(200).json({ success: true, message: "Table reserved successfully", table });
    } catch (error) {
        next(error);
    }
};

const cancelReservation = async (req, res, next) => {
    try {
        const { id } = req.params;
        const table = await Table.findById(id);

        if (!table) throw new ApiError(404, "Table not found");

        if (table.status !== "Reserved") {
            return res.status(400).json({ success: false, message: "Table is not reserved" });
        }

        table.status = "Available";
        table.reservation = undefined; // Clear reservation details
        table.person = null; // Unlink user
        table.client = null; // Unlink client

        await table.save();
        res.status(200).json({ success: true, message: "Reservation canceled", table });
    } catch (error) {
        next(error);
    }
};

module.exports = { createTable, getTables, updateTable, deleteTable, reserveTable, cancelReservation };
