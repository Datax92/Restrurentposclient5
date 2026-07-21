require("dotenv").config();
// const { GoogleGenerativeAI } = require("@google/generative-ai");

async function checkModels() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.log("❌ Error: GEMINI_API_KEY is missing from .env");
        return;
    }
    console.log(`🔑 Using API Key: ${key.substring(0, 8)}...`);

    try {
        // We can't list models directly with the high-level SDK easily in all versions,
        // so we'll try to fetch the list via REST API using the key to be 100% sure.
        // Use global fetch
        const fetch = globalThis.fetch;

        // Explicitly check available models via HTTP to bypass SDK quirks
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await response.json();

        if (data.models) {
            console.log("\n✅ Available Models for this Key:");
            data.models.forEach(m => {
                if (m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`   - ${m.name.replace('models/', '')}`);
                }
            });
        } else {
            console.log("❌ Failed to list models. Response:", data);
        }

    } catch (error) {
        console.error("❌ Fatal Error:", error);
    }
}

checkModels();
