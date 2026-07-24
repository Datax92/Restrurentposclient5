/**
 * Fix Admin Password — resets admin to correct single-hash password
 * Run: node scripts/fix-admin.js
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const dns = require("dns");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const ADMIN_EMAIL    = "admin@tastystation.com";
const ADMIN_PASSWORD = "Admin@123";

async function fixAdmin() {
    console.log("🔌 Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 30000,
        connectTimeoutMS: 30000,
    });
    console.log("✅ Connected.\n");

    // Use raw collection to bypass the pre-save hook (avoid double hash)
    const collection = mongoose.connection.collection("users");

    const correctHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

    const result = await collection.updateOne(
        { email: ADMIN_EMAIL },
        { $set: { password: correctHash, role: "admin", isActive: true } },
        { upsert: true }
    );

    if (result.upsertedCount > 0) {
        console.log("🎉 Admin user created fresh!\n");
    } else {
        console.log("🔄 Admin password reset successfully!\n");
    }

    console.log("┌─────────────────────────────────────┐");
    console.log("│         ADMIN LOGIN DETAILS          │");
    console.log("├─────────────────────────────────────┤");
    console.log(`│  Email   : ${ADMIN_EMAIL.padEnd(26)}│`);
    console.log(`│  Password: ${ADMIN_PASSWORD.padEnd(26)}│`);
    console.log("└─────────────────────────────────────┘");

    await mongoose.disconnect();
    console.log("\n✅ Done!");
}

fixAdmin().catch((err) => {
    console.error("❌ Failed:", err.message);
    process.exit(1);
});
