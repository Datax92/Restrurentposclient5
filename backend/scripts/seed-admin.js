/**
 * Seed Script — Create Admin User
 * Run once: node scripts/seed-admin.js
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const dns = require("dns");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Force Google DNS (same fix as connection.js)
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const ADMIN = {
    name:     "Admin",
    email:    "admin@tastystation.com",
    password: "Admin@123",
    role:     "admin",
    isActive: true
};

async function seedAdmin() {
    console.log("🔌 Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 30000,
        connectTimeoutMS: 30000,
    });
    console.log("✅ Connected.\n");

    // Use raw MongoDB collection to bypass the pre-save hook (avoids double-hashing)
    const collection = mongoose.connection.collection("users");

    const existing = await collection.findOne({ email: ADMIN.email });
    if (existing) {
        console.log(`⚠️  Admin already exists:`);
        console.log(`   Email : ${existing.email}`);
        console.log(`   Role  : ${existing.role}`);
        console.log(`\n   Run: node scripts/fix-admin.js  to reset the password.`);
        await mongoose.disconnect();
        return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN.password, 10);
    await collection.insertOne({ ...ADMIN, password: hashedPassword, createdAt: new Date(), updatedAt: new Date() });

    console.log("🎉 Admin user created successfully!\n");
    console.log("┌─────────────────────────────────────┐");
    console.log("│         ADMIN LOGIN DETAILS          │");
    console.log("├─────────────────────────────────────┤");
    console.log(`│  Email   : ${ADMIN.email.padEnd(26)}│`);
    console.log(`│  Password: ${ADMIN.password.padEnd(26)}│`);
    console.log(`│  Role    : ${ADMIN.role.padEnd(26)}│`);
    console.log("└─────────────────────────────────────┘");

    await mongoose.disconnect();
    console.log("\n🔌 Disconnected. Done!");
}

seedAdmin().catch((err) => {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
});
