const Client = require("../models/client.model");
// const Order = require("../models/order.model");

// Get all clients with summary statistics
exports.getAllClients = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const totalClients = await Client.countDocuments();
        const clients = await Client.find()
            .select("name email phone totalSpent lastVisit orders")
            .sort({ lastVisit: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const clientData = clients.map(client => ({
            ...client._doc,
            orderCount: client.orders.length
        }));

        res.status(200).json({
            success: true,
            clients: clientData,
            pagination: {
                totalClients,
                totalPages: Math.ceil(totalClients / limit),
                currentPage: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching clients",
            error: error.message
        });
    }
};

// Get detailed client history including all orders
exports.getClientHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await Client.findById(id).populate({
            path: 'orders',
            options: { sort: { createdAt: -1 } },
            populate: [
                { path: 'user', select: 'name' },
                { path: 'table', select: 'name' }
            ]
        });

        if (!client) {
            return res.status(404).json({
                success: false,
                message: "Client not found"
            });
        }

        res.status(200).json({
            success: true,
            client
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching client history",
            error: error.message
        });
    }
};

// Delete a client
exports.deleteClient = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await Client.findByIdAndDelete(id);

        if (!client) {
            return res.status(404).json({
                success: false,
                message: "Client not found"
            });
        }

        // Note: We might want to keep orders but remove the client reference or handle it based on business rules
        // For now, we just delete the client record.

        res.status(200).json({
            success: true,
            message: "Client record deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting client",
            error: error.message
        });
    }
};
