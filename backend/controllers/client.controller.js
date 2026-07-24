const Client = require("../models/client.model");
const ApiError = require("../utils/ApiError");

// Get all clients with summary statistics
exports.getAllClients = async (req, res, next) => {
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
        next(error);
    }
};

// Get detailed client history including all orders
exports.getClientHistory = async (req, res, next) => {
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
            throw new ApiError(404, "Client not found");
        }

        res.status(200).json({
            success: true,
            client
        });
    } catch (error) {
        next(error);
    }
};

// Delete a client
exports.deleteClient = async (req, res, next) => {
    try {
        const { id } = req.params;
        const client = await Client.findByIdAndDelete(id);

        if (!client) {
            throw new ApiError(404, "Client not found");
        }

        res.status(200).json({
            success: true,
            message: "Client record deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};
