const _mongoose = require("mongoose");
require("dotenv").config();
const connectDB = require("./config/database/connection");

const User = require("./models/user.model");
const { Category, MenuItem } = require("./models/menu.model");
const Table = require("./models/table.model");
const Client = require("./models/client.model");
const Inventory = require("./models/inventory.model");
const Tax = require("./models/tax.model");
const Discount = require("./models/discount.model");
const Order = require("./models/order.model");

const data = require("./data");

const seedData = async () => {
    try {
        await connectDB();
        console.log("Connected to MongoDB for seeding...");

        // 1. Clear existing specific operational and config data
        console.log("Cleaning existing data...");
        await User.deleteMany({});
        await Category.deleteMany({});
        await MenuItem.deleteMany({});
        await Table.deleteMany({});
        await Client.deleteMany({});
        await Inventory.deleteMany({});
        await Tax.deleteMany({});
        await Discount.deleteMany({});
        await Order.deleteMany({});
        console.log("Database cleared.");

        // 2. Seed Users
        console.log("Seeding Users...");
        const bcrypt = require("bcryptjs");
        const usersWithHashedPasswords = data.users.map(u => ({
            ...u,
            password: bcrypt.hashSync(u.password, 10)
        }));
        await User.insertMany(usersWithHashedPasswords);
        console.log(`Inserted ${usersWithHashedPasswords.length} users.`);

        // 3. Seed Categories
        console.log("Seeding Categories...");
        const createdCategories = await Category.insertMany(data.categories);
        console.log(`Inserted ${createdCategories.length} categories.`);

        // 4. Seed Menu Items (Linking to Categories)
        console.log("Seeding Menu Items...");
        const menuItemsWithIds = data.menuItems.map(item => {
            const category = createdCategories.find(c => c.name === item.categoryName);
            const { categoryName: _, ...rest } = item;
            return {
                ...rest,
                category: category ? category._id : null
            };
        });
        await MenuItem.insertMany(menuItemsWithIds);
        console.log(`Inserted ${menuItemsWithIds.length} menu items.`);

        // 5. Seed Tables
        console.log("Seeding Tables...");
        await Table.insertMany(data.tables);
        console.log(`Inserted ${data.tables.length} tables.`);

        // 6. Seed Clients
        console.log("Seeding Clients...");
        await Client.insertMany(data.clients);
        console.log(`Inserted ${data.clients.length} clients.`);

        // 7. Seed Inventory
        console.log("Seeding Inventory...");
        await Inventory.insertMany(data.inventory);
        console.log(`Inserted ${data.inventory.length} inventory items.`);

        // 8. Seed Taxes & Discounts
        console.log("Seeding Taxes and Discounts...");
        await Tax.insertMany(data.taxes);
        await Discount.insertMany(data.discounts);
        console.log("Seeded Taxes and Discounts.");

        console.log("Data Seeding Completed Successfully! 🚀");
        process.exit(0);

    } catch (error) {
        console.error("Error Seeding Data:", error);
        process.exit(1);
    }
};

seedData();
