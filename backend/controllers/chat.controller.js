const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
// note: It requires GEMINI_API_KEY in .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

const Order = require("../models/order.model");

exports.sendMessage = async (req, res) => {
    try {
        const { message, context } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({
                error: "Gemini API Key is missing. Please add GEMINI_API_KEY to your backend .env file."
            });
        }

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        // --- FETCH REAL-TIME DATA ---
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const stats = await Order.aggregate([
            { $match: { createdAt: { $gte: startOfDay }, status: "Completed" } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalAmount" },
                    totalOrders: { $sum: 1 }
                }
            }
        ]);

        const revenue = stats.length > 0 ? stats[0].totalRevenue : 0;
        const orders = stats.length > 0 ? stats[0].totalOrders : 0;
        // -----------------------------

        // Construct the prompt with system instructions and user context
        // We can enhance this "System Prompt" significantly
        const systemInstruction = `
      You are a POS System Assistant.
      
      CRITICAL: Be extremely concise. 
      - If the user says "hi", say "Hi."
      - Answer ONLY what is asked.
      - Do NOT offer unsolicited help or context.
      - Do NOT use flowery language.
      
      REAL-TIME DATA (Today):
      - Revenue: $${revenue}
      - Orders: ${orders}
      
      Context: ${context || "None"}
    `;

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: systemInstruction }],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I will be concise." }],
                },
            ],
            generationConfig: {
                maxOutputTokens: 500,
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        return res.status(200).json({ reply: text });

    } catch (error) {
        console.error("Gemini Chat Error:", error);
        return res.status(500).json({ error: "Failed to generate response from AI." });
    }
};
