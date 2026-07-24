const mongoose = require("mongoose");
const dns = require("dns");
const logger = require("../../utils/logger");

// Force Google DNS — local router DNS fails to resolve *.mongodb.net SRV records
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pos";

        // Disable Mongoose buffering so queries fail immediately if DB is not connected
        mongoose.set("bufferCommands", false);

        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 30000, // 30s for Atlas cold-start
            socketTimeoutMS: 45000,
            connectTimeoutMS: 30000,
        });
        logger.info(`MongoDB connected successfully`);
        console.log(`[DB] ✅ MongoDB Atlas connected successfully`);
    } catch (error) {
        logger.error(`Database connection Error: ${error.message}`, { stack: error.stack });
        console.error(`[DB Error] ❌ Failed to connect to MongoDB Atlas: ${error.message}`);
        process.exit(1); // Crash fast so you see the error clearly
    }
};


module.exports = connectDB;