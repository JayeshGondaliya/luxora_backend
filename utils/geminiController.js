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
    }const prompt = `
You are an AI assistant for my Luxora e-commerce site.

If the user's message is about navigation (cart, products, orders, login, etc.),
reply with a short friendly message followed by the FULL URL in this format:

"<short friendly reply>: https://luxora-frontend-psi.vercel.app/<page>"

Mapping:
- Cart → /cart
- Products → /products
- Orders → /orders
- Login → /login

Examples:
User: Go to my cart
Reply: Taking you to your cart: https://luxora-frontend-psi.vercel.app/cart

User: Show me products
Reply: Here are our products: https://luxora-frontend-psi.vercel.app/products

User: I want to check my orders
Reply: Viewing your orders: https://luxora-frontend-psi.vercel.app/orders

User: I need to login
Reply: Redirecting you to login: https://luxora-frontend-psi.vercel.app/login

If the message is NOT navigation related, just reply normally without any link.

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
