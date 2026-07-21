const mongoose = require("mongoose");
const Client = require("./models/client.model");
const { MenuItem } = require("./models/menu.model");
const Order = require("./models/order.model");
const connectDB = require("./config/database/connection");
require("dotenv").config();

const verify = async () => {
    try {
        await connectDB();
        console.log("Connected to DB");

        // 1. Get a Client
        let client = await Client.findOne();
        if (!client) {
            console.log("No client found, creating one...");
            client = await Client.create({
                name: "Test Client",
                email: "test@example.com",
                phone: "1234567890"
            });
        }
        console.log("Client ID:", client._id);

        // 2. Get a Menu Item
        let menuItem = await MenuItem.findOne();
        if (!menuItem) {
            console.log("No menu item found, skipping order test (seed menu first)");
            process.exit(0);
        }
        console.log("MenuItem ID:", menuItem._id, "Price:", menuItem.price);

        // 3. Create Dummy Order Data (Simulating Controller Logic locally to verify Model/Schema)
        // Note: To test the actual API controller, we should use Axios/Fetch, but let's test the Model integration first.

        console.log("Creating Order via Model...");
        const newOrder = new Order({
            orderId: `TEST-${Date.now()}`,
            type: "Takeaway",
            paymentMethod: "Cash",
            items: [{
                menuItem: menuItem._id,
                name: menuItem.name,
                price: menuItem.price,
                quantity: 2
            }],
            totalAmount: menuItem.price * 2,
            client: client._id,
            user: client._id // Using client as user for dummy test if User not found, or fetch user
        });

        await newOrder.save();
        console.log("Order Saved:", newOrder._id);

        // 4. Verify Client Update
        await Client.findByIdAndUpdate(client._id, {
            $push: { orders: newOrder._id },
            $inc: { totalSpent: newOrder.totalAmount },
            $set: { lastVisit: new Date() }
        });

        const updatedClient = await Client.findById(client._id);
        console.log("Client Updated. Total Spent:", updatedClient.totalSpent);

        console.log("Verification Successful!");

    } catch (error) {
        console.error("Verification Failed:", error);
    } finally {
        mongoose.connection.close();
    }
};

verify();
