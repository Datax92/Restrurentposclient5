const Table = require("../models/table.model");
const User = require("../models/user.model");
const Client = require("../models/client.model");

const createTable = async (req, res) => {
    try {
        const { name, zone, capacity } = req.body;
        const existingTable = await Table.findOne({ name });
        if (existingTable) {
            return res.status(400).json({ success: false, message: "Table already exists" });
        }
        const table = await Table.create({ name, zone, capacity });
        res.status(201).json({ success: true, message: "Table created", table });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getTables = async (req, res) => {
    try {
        const tables = await Table.find()
            .populate("person", "name email phoneNumber avatar")
            .populate("client", "name phone email avatar totalSpent");
        res.status(200).json({ success: true, tables });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateTable = async (req, res) => {
    try {
        const { id } = req.params;
        const table = await Table.findByIdAndUpdate(id, req.body, { new: true });
        if (!table) return res.status(404).json({ success: false, message: "Table not found" });
        res.status(200).json({ success: true, message: "Table updated", table });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteTable = async (req, res) => {
    try {
        const { id } = req.params;
        const table = await Table.findByIdAndDelete(id);
        if (!table) return res.status(404).json({ success: false, message: "Table not found" });
        res.status(200).json({ success: true, message: "Table deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const reserveTable = async (req, res) => {
    try {
        const { id } = req.params;
        const { bookedBy, contact, guests, date, notes } = req.body;

        const table = await Table.findById(id);
        if (!table) return res.status(404).json({ success: false, message: "Table not found" });

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
                // Optional: Auto-fill reservation details from user if missing?
                // For now, we respect provided details or fallback could be added here.
            }
        }

        await table.save();

        res.status(200).json({ success: true, message: "Table reserved successfully", table });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const cancelReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const table = await Table.findById(id);

        if (!table) return res.status(404).json({ success: false, message: "Table not found" });

        if (table.status !== "Reserved") {
            return res.status(400).json({ success: false, message: "Table is not reserved" });
        }

        if (table.client) {
            // Optional: Update client booking status to Cancelled?
            // const client = await Client.findById(table.client);
            // if (client) { ... }
        }

        table.status = "Available";
        table.reservation = undefined; // Clear reservation details
        table.person = null; // Unlink user
        table.client = null; // Unlink client

        await table.save();
        res.status(200).json({ success: true, message: "Reservation canceled", table });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createTable, getTables, updateTable, deleteTable, reserveTable, cancelReservation };
