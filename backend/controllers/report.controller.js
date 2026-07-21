const Order = require("../models/order.model");
// const { MenuItem } = require("../models/menu.model");
// const User = require("../models/user.model");
// const mongoose = require("mongoose");

// Helper to get date range
const getDateRange = (filter) => {
    const now = new Date();
    let startDate;

    switch (filter) {
        case "daily":
            startDate = new Date(now.setHours(0, 0, 0, 0));
            break;
        case "weekly": {
            const day = now.getDay();
            const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
            startDate = new Date(now.setDate(diff));
            startDate.setHours(0, 0, 0, 0);
            break;
        }
        case "monthly":
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
        case "yearly":
            startDate = new Date(now.getFullYear(), 0, 1);
            break;
        default:
            startDate = new Date(0); // All time
    }
    return startDate;
};

// 1. Sales Reports (Daily/Weekly/Monthly Trends)
exports.getSalesReports = async (req, res) => {
    try {
        const { filter = "daily" } = req.query;
        const startDate = getDateRange(filter);

        let groupBy;
        if (filter === "daily") {
            groupBy = { $dateToString: { format: "%Y-%m-%d %H:00", date: "$createdAt" } }; // Hourly for daily
        } else if (filter === "weekly" || filter === "monthly") {
            groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }; // Daily for weekly/monthly
        } else {
            groupBy = { $dateToString: { format: "%Y-%m", date: "$createdAt" } }; // Monthly for yearly
        }

        const sales = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate }, status: "Completed" } },
            {
                $group: {
                    _id: groupBy,
                    totalSales: { $sum: "$totalAmount" },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({ success: true, data: sales });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Cashier-wise Collection
exports.getCashierCollections = async (req, res) => {
    try {
        const { filter = "daily" } = req.query;
        const startDate = getDateRange(filter);

        const collections = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate }, status: "Completed" } },
            {
                $group: {
                    _id: "$user",
                    totalCollected: { $sum: "$totalAmount" },
                    orderCount: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "cashier"
                }
            },
            { $unwind: "$cashier" },
            {
                $project: {
                    _id: 1,
                    totalCollected: 1,
                    orderCount: 1,
                    cashierName: "$cashier.name",
                    cashierEmail: "$cashier.email"
                }
            },
            { $sort: { totalCollected: -1 } }
        ]);

        res.status(200).json({ success: true, data: collections });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Top Selling Items
exports.getTopSellingItems = async (req, res) => {
    try {
        const { filter = "daily", limit = 10 } = req.query;
        const startDate = getDateRange(filter);

        const topItems = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate }, status: "Completed" } },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.menuItem",
                    name: { $first: "$items.name" },
                    totalQuantity: { $sum: "$items.quantity" },
                    totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
                }
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: parseInt(limit) }
        ]);

        res.status(200).json({ success: true, data: topItems });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Profit & Loss Statements
exports.getProfitLoss = async (req, res) => {
    try {
        const { filter = "monthly" } = req.query;
        const startDate = getDateRange(filter);

        const report = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate }, status: "Completed" } },
            { $unwind: "$items" },
            {
                $lookup: {
                    from: "menuitems",
                    localField: "items.menuItem",
                    foreignField: "_id",
                    as: "menuDetails"
                }
            },
            { $unwind: "$menuDetails" },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
                    totalCost: { $sum: { $multiply: [{ $ifNull: ["$menuDetails.costPrice", 0] }, "$items.quantity"] } },
                    totalOrders: { $addToSet: "$_id" }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalRevenue: 1,
                    totalCost: 1,
                    profit: { $subtract: ["$totalRevenue", "$totalCost"] },
                    orderCount: { $size: "$totalOrders" }
                }
            }
        ]);

        res.status(200).json({ success: true, data: report[0] || { totalRevenue: 0, totalCost: 0, profit: 0, orderCount: 0 } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
