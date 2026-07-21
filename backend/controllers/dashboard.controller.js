const Order = require("../models/order.model");
const Table = require("../models/table.model");
const Inventory = require("../models/inventory.model");
const User = require("../models/user.model");
const Client = require("../models/client.model");

exports.getDashboardOverview = async (req, res, next) => {
    try {
        const now = new Date();
        const startOfToday = new Date(now.setHours(0, 0, 0, 0));

        // 1. Revenue & Orders (Today)
        const todayStats = await Order.aggregate([
            { $match: { createdAt: { $gte: startOfToday }, status: "Completed" } },
            {
                $group: {
                    _id: null,
                    revenue: { $sum: "$totalAmount" },
                    orders: { $sum: 1 }
                }
            }
        ]);

        // 2. Occupancy Summary
        const tables = await Table.find().select("status");
        const occupancy = {
            available: tables.filter(t => t.status === "Available").length,
            occupied: tables.filter(t => t.status === "Occupied").length,
            reserved: tables.filter(t => t.status === "Reserved").length,
            total: tables.length
        };

        // 3. Inventory Alerts (Low Stock)
        const lowStockItems = await Inventory.find({
            $expr: { $lte: ["$quantity", "$reorderLevel"] }
        }).limit(5);
        const lowStockCount = await Inventory.countDocuments({
            $expr: { $lte: ["$quantity", "$reorderLevel"] }
        });

        // 4. Staff Summary
        const activeStaff = await User.countDocuments({ role: { $ne: "client" }, isActive: true });

        // 5. Recent Activity
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("client", "name")
            .select("orderId totalAmount status createdAt");

        const recentClients = await Client.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select("name totalSpent createdAt");

        res.status(200).json({
            success: true,
            data: {
                summary: {
                    todayRevenue: todayStats[0]?.revenue || 0,
                    todayOrders: todayStats[0]?.orders || 0,
                    occupancy,
                    lowStockCount,
                    activeStaff
                },
                lowStockItems,
                recentOrders,
                recentClients
            }
        });
    } catch (error) {
        next(error);
    }
};
