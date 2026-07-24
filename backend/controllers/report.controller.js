const Order = require("../models/order.model");

// Helper to build a date range from filter string OR custom start/end dates
const getDateRange = (filter, startDate, endDate) => {
    if (startDate && endDate) {
        return {
            start: new Date(startDate),
            end:   new Date(new Date(endDate).setHours(23, 59, 59, 999))
        };
    }

    const now = new Date();
    let start;

    switch (filter) {
        case "daily":
            start = new Date(now.setHours(0, 0, 0, 0));
            break;
        case "weekly": {
            const day  = now.getDay();
            const diff = now.getDate() - day + (day === 0 ? -6 : 1);
            start = new Date(now.setDate(diff));
            start.setHours(0, 0, 0, 0);
            break;
        }
        case "monthly":
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
        case "yearly":
            start = new Date(now.getFullYear(), 0, 1);
            break;
        default:
            start = new Date(0); // All time
    }
    return { start, end: new Date() };
};

// 1. Sales Reports (Daily/Weekly/Monthly Trends)
exports.getSalesReports = async (req, res) => {
    try {
        const { filter = "daily", startDate, endDate } = req.query;
        const { start, end } = getDateRange(filter, startDate, endDate);

        let groupBy;
        if (filter === "daily" && !startDate) {
            groupBy = { $dateToString: { format: "%Y-%m-%d %H:00", date: "$createdAt" } };
        } else if (filter === "yearly") {
            groupBy = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
        } else {
            groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
        }

        const sales = await Order.aggregate([
            { $match: { createdAt: { $gte: start, $lte: end }, status: "Completed" } },
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
        const { filter = "daily", startDate, endDate } = req.query;
        const { start, end } = getDateRange(filter, startDate, endDate);

        const collections = await Order.aggregate([
            { $match: { createdAt: { $gte: start, $lte: end }, status: "Completed" } },
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
        const { filter = "daily", startDate, endDate, limit = 10 } = req.query;
        const { start, end } = getDateRange(filter, startDate, endDate);

        const topItems = await Order.aggregate([
            { $match: { createdAt: { $gte: start, $lte: end }, status: "Completed" } },
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
        const { filter = "monthly", startDate, endDate } = req.query;
        const { start, end } = getDateRange(filter, startDate, endDate);

        const report = await Order.aggregate([
            { $match: { createdAt: { $gte: start, $lte: end }, status: "Completed" } },
            { $unwind: "$items" },
            {
                $lookup: {
                    from: "menuitems",
                    localField: "items.menuItem",
                    foreignField: "_id",
                    as: "menuDetails"
                }
            },
            { $unwind: { path: "$menuDetails", preserveNullAndEmpty: true } },
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

// 5. Full orders list with date filter (for report table)
exports.getOrdersReport = async (req, res) => {
    try {
        const { filter = "monthly", startDate, endDate } = req.query;
        const { start, end } = getDateRange(filter, startDate, endDate);

        const orders = await Order.find({
            createdAt: { $gte: start, $lte: end },
            status: "Completed"
        })
            .populate("user", "name email")
            .populate("table", "name zone")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

