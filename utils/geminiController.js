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
    }
const prompt = `
You are an AI assistant specialized ONLY for my Luxora e-commerce related questions 
such as products, orders, payments, shipping, returns, login, etc.

If the user's message matches a navigation action, respond EXACTLY in JSON format:

Example:
{"action": "redirect", "url": "/cart"}
{"action": "redirect", "url": "/products"}
{"action": "redirect", "url": "/orders"}
{"action": "redirect", "url": "/login"}

If it is just a normal question, respond in this format:
{"action": "reply", "message": "<your reply here>"}

Do NOT add any extra words outside the JSON.

User: ${userMessage}
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
