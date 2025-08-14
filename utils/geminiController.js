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
You are an AI assistant specialized ONLY for my Luxora e-commerce related questions 
such as products, orders, payments, shipping, returns, login, etc.

Respond ONLY in valid JSON format with these rules:

If the user wants to navigate to a page, respond with:
{"url": "https://luxora-frontend-psi.vercel.app/cart"}
{"url": "https://luxora-frontend-psi.vercel.app/products"}
{"url": "https://luxora-frontend-psi.vercel.app/orders"}
{"url": "https://luxora-frontend-psi.vercel.app/login"}

If the user is asking a normal question, respond with:
{"message": "<your reply here>"}

Rules:
- Respond with ONLY one JSON object.
- Do NOT include any other text, explanation, or formatting.
- Do NOT use markdown or code blocks.
- Do NOT include trailing commas.
- The "url" must be a complete URL including https://luxora-frontend-psi.vercel.app
- If unsure, return a "message".

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
