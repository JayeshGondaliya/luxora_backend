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
You are an AI assistant specialized ONLY for my Luxora e-commerce related questions such as products, orders, payments, shipping, returns, etc.

If the user's message is a casual greeting (e.g., "hi", "hello", "hey"), respond politely and invite them to ask about e-commerce.

If the user's question is NOT related to e-commerce or asks about other websites, brands, or topics outside this domain, reply ONLY with:
"Sorry, I can only help with e-commerce related queries."

Now answer the question: ${userMessage}
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
