import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './DB/ConnectDB.js';
import authRoutes from './route/authroute.js';
import childRoutes from './route/Children.route.js';
import { GoogleGenAI } from "@google/genai";



// Load env vars
dotenv.config();

// Connect to database
await connectDB();

const app = express();

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/children', childRoutes);

// Basic route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Vaccination Tracker API',
        version: '1.0.0'
    });
});


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


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: err.message
    });
});

const PORT = process.env.PORT || 5000;

(async () => {
    try {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Server startup error:', error);
        process.exit(1);
    }
})();