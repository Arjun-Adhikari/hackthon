import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import ConnectDB from "./DB/ConnectDB.js";
import ChildrenRoute from './route/Children.route.js'

dotenv.config();

const app = express();

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


app.use('/api/children',ChildrenRoute)

const startServer = async () => {
    try {   
        await ConnectDB();
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Error starting server:", error.message);
        process.exit(1);
    }
};


startServer();
