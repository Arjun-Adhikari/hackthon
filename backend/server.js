import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import crypto from 'crypto';
import axios from 'axios';
import multer from 'multer';
import connectDB from './DB/ConnectDB.js';
import authRoutes from './route/authroute.js';
import childRoutes from './route/Children.route.js';
import { Client } from "@googlemaps/google-maps-services-js";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import user from './Model/User.model.js'

// Load env vars
dotenv.config();

// Connect to database
await connectDB();

const app = express();

// Initialize AI and Maps clients
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
const googleMapsClient = new Client({});

// Configure multer for file uploads (audio)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- eSewa Configuration ---
const esewaConfig = {
    merchantId: process.env.ESEWA_MERCHANT_ID || "EPAYTEST",
    successUrl: process.env.ESEWA_SUCCESS_URL || "http://localhost:5173/payment-success",
    failureUrl: process.env.ESEWA_FAILURE_URL || "http://localhost:5173/payment-failure",
    esewaPaymentUrl: "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
    secret: process.env.ESEWA_SECRET || "8gBm/:&EnhH.1/q",
};

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/children', childRoutes);

// Basic route
app.get('/', (req, res) => {
    res.json({
        message: 'Vaccination Tracker API',
        version: '1.0.0'
    });
});

// eSewa Initiate Payment Route
app.post("/api/payment/initiate-payment", async (req, res) => {
    try {
        const { amount, productId } = req.body;

        if (!amount || !productId) {
            return res.status(400).json({ error: "Amount and Product ID are required" });
        }

        let paymentData = {
            amount: amount,
            failure_url: esewaConfig.failureUrl,
            product_delivery_charge: "0",
            product_service_charge: "0",
            product_code: esewaConfig.merchantId,
            signed_field_names: "total_amount,transaction_uuid,product_code",
            success_url: esewaConfig.successUrl,
            tax_amount: "0",
            total_amount: amount,
            transaction_uuid: productId,
        };

        // Create signature string
        const data = `total_amount=${paymentData.total_amount},transaction_uuid=${paymentData.transaction_uuid},product_code=${paymentData.product_code}`;

        // Generate Hash
        const signature = generateHmacSha256Hash(data, esewaConfig.secret);
        paymentData = { ...paymentData, signature };

        // Post to eSewa
        const paymentResponse = await axios.post(esewaConfig.esewaPaymentUrl, null, {
            params: paymentData,
        });

        // Use safeStringify to handle circular references in axios response
        const reqPayment = JSON.parse(safeStringify(paymentResponse));

        if (reqPayment.status === 200) {
            return res.json({
                url: reqPayment.request.res.responseUrl,
            });
        } else {
            return res.status(400).json({ error: "Failed to initiate payment with eSewa" });
        }
    } catch (error) {
        console.error("Payment Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Gemini AI Chat Route with Audio and Location Support
app.post('/api/chat', upload.single('audio'), async (req, res) => {
    try {
        const { message, location } = req.body;
        const audioFile = req.file;

        console.log("📨 Chat request received");
        console.log("Message:", message);
        console.log("Location:", location);
        console.log("Audio file:", audioFile ? `${audioFile.size} bytes` : 'none');

        let hospitalContext = "";
        let userMessage = message || "";

        // If location is provided, fetch nearby hospitals
        if (location) {
            try {
                const locationData = typeof location === 'string' ? JSON.parse(location) : location;

                if (locationData && locationData.lat && locationData.lng) {
                    console.log("🗺️ Fetching nearby hospitals...");
                    const mapsRes = await googleMapsClient.placesNearby({
                        params: {
                            location: { lat: locationData.lat, lng: locationData.lng },
                            radius: 5000, // 5km radius
                            type: 'hospital',
                            key: process.env.GOOGLE_MAPS_API_KEY
                        }
                    });

                    if (mapsRes.data.results && mapsRes.data.results.length > 0) {
                        const hospitals = mapsRes.data.results.slice(0, 3).map(h => h.name).join(", ");
                        hospitalContext = `\n\n[Context: User's nearby hospitals within 5km: ${hospitals}]`;
                        console.log("✅ Found hospitals:", hospitals);
                    }
                }
            } catch (locError) {
                console.warn("⚠️ Location processing failed:", locError.message);
            }
        }

        // If audio file is provided, you would need to:
        // 1. Convert audio to text using a speech-to-text service
        // 2. Or send audio directly to Gemini if it supports audio input
        // For now, we'll use the text message
        if (audioFile) {
            console.log("⚠️ Audio processing not yet implemented - using text fallback");
            userMessage = userMessage || "🎤 [Audio message received but transcription not implemented]";
        }

        if (!userMessage) {
            return res.status(400).json({ error: "No message or audio provided" });
        }

        console.log("🤖 Sending to Gemini...");

        // Send to Gemini with hospital context
        const fullPrompt = `You are a helpful vaccination assistant. Answer the user's question about vaccinations, health, or nearby medical facilities.

${hospitalContext}

User question: ${userMessage}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: fullPrompt,
            config: {
                thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
            }
        });

        console.log("✅ Response generated");

        res.json({
            reply: response.text,
            hospitalsFound: hospitalContext ? true : false
        });

    } catch (error) {
        console.error("❌ Chat Error:", error.message);
        res.status(500).json({ error: "Failed to process chat request" });
    }
});


app.put('/api/user/verify', async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        // 2. Update the user in MongoDB
        const updatedUser = await user.findByIdAndUpdate(
            userId,
            { isVerified: true },
            { new: true } // Returns the document AFTER the update
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // 3. Send back the updated user
        res.status(200).json({
            success: true,
            message: "User successfully verified in database",
            data: updatedUser
        });
    } catch (error) {
        console.error('Error updating child:', error);
        res.status(500).json({ error: 'Failed to update child' });
    }
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: err.message
    });
});

// --- Helper Functions ---

function generateHmacSha256Hash(data, secret) {
    if (!data || !secret) {
        throw new Error("Both data and secret are required to generate a hash.");
    }
    return crypto
        .createHmac("sha256", secret)
        .update(data)
        .digest("base64");
}

function safeStringify(obj) {
    const cache = new Set();
    return JSON.stringify(obj, (key, value) => {
        if (typeof value === "object" && value !== null) {
            if (cache.has(value)) return;
            cache.add(value);
        }
        return value;
    });
}

const PORT = process.env.PORT || 5000;

(async () => {
    try {
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📍 API Endpoints:`);
            console.log(`   - POST /api/chat (with audio support)`);
            console.log(`   - POST /api/payment/initiate-payment`);
            console.log(`   - Auth routes: /api/auth/*`);
            console.log(`   - Children routes: /api/children/*`);
        });
    } catch (error) {
        console.error('❌ Server startup error:', error);
        process.exit(1);
    }
})();