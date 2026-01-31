import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Standard Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize AI with the specific model you requested
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    // Using your specific Gemini 3 model
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: message,
    });

    res.json(response.text);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to generate response" });
  }
});

// Basic Health Check
app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
  console.log(`Chat endpoint: http://localhost:${port}/api/chat`);
});