import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
dotenv.config();

const geminiRouter = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

geminiRouter.post("/chat", async (req, res) => {
  try {
    const { userMessage } = req.body;

    if (!userMessage || userMessage.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }const baseUrl = "https://luxora-frontend-psi.vercel.app";

const prompt = `
You are an AI assistant for my Luxora e-commerce site.

If the user's message is about one of these pages:
- Cart → ${baseUrl}/cart
- Products → ${baseUrl}/products
- Orders → ${baseUrl}/orders
- Login → ${baseUrl}/login
- All Products → ${baseUrl}/productspage

Then reply with ONE short friendly sentence **and** include the FULL clickable link as HTML <a> tag with target="_blank" and rel="noopener noreferrer".

Examples:
User: Go to my cart
Reply: Taking you to your cart: <a href="${baseUrl}/cart" target="_blank" rel="noopener noreferrer">${baseUrl}/cart</a>

User: Show me products
Reply: Here are our products: <a href="${baseUrl}/products" target="_blank" rel="noopener noreferrer">${baseUrl}/products</a>

User: I want to check my orders
Reply: Viewing your orders: <a href="${baseUrl}/orders" target="_blank" rel="noopener noreferrer">${baseUrl}/orders</a>

User: I want to check all products
Reply: Here’s the full product catalog: <a href="${baseUrl}/productspage" target="_blank" rel="noopener noreferrer">${baseUrl}/productspage</a>

User: I need to login
Reply: Redirecting you to login: <a href="${baseUrl}/login" target="_blank" rel="noopener noreferrer">${baseUrl}/login</a>

Important:
- If the user's message clearly matches ONLY "orders", show ONLY the orders link in the reply.
- If it’s not about these pages, answer normally with no HTML link.

User message: ${userMessage}
`;




    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
console.log("result",result?.response?.text);

    const aiText = result?.response?.text() || "Sorry, I couldn't understand that.";

    res.json({ reply: aiText });

  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Something went wrong with AI service" });
  }
});

export default geminiRouter;
