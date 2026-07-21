require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
    if (!process.env.GEMINI_API_KEY) {
        console.error("Error: GEMINI_API_KEY not found in .env");
        return;
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Dummy init to get client
        // There isn't a direct "listModels" on the client instance in some versions, 
        // but we can try to hit the API directly or use the correct method if available.
        // Actually, for the Node SDK, we might validly just try a known working model 
        // or print the error details more clearly. 

        // Let's try 'gemini-pro' specifically again but log everything
        console.log("Attempting to connect with key: ", process.env.GEMINI_API_KEY.substring(0, 5) + "...");

        // The error suggests "Call ListModels". In the Node SDK, this is often not directly exposed 
        // on the main class in older versions, but let's try a direct fetch if needed.
        // However, let's first try just running a simple generation with 'gemini-1.5-flash' again
        // to see if it works in isolation.

        const result = await model.generateContent("Test");
        console.log("Success! Model found.");
        console.log(result.response.text());

    } catch (error) {
        console.error("Detailed Error:", error.message);
        if (error.response) {
            console.error("Response:", await error.response.json());
        }
    }
}

listModels();
