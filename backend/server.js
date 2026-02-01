import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import crypto from 'crypto';
import axios from 'axios';
import connectDB from './DB/ConnectDB.js';
import authRoutes from './route/authroute.js';
import childRoutes from './route/Children.route.js';
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import user from './Model/User.model.js'
import { log } from 'console';

// Load env vars
dotenv.config();

// Connect to database
await connectDB();

const app = express();

// Initialize AI client
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.post('/api/chat', async (req, res) => {
    try {
        console.log("📨 Raw request body:", req.body);

        // Check if req.body exists
        if (!req.body) {
            return res.status(400).json({ error: "Request body is empty" });
        }

        const { message, lat, long } = req.body;

        console.log("📨 Chat request received");
        console.log("Message:", message);

        if (!message || message.trim() === '') {
            return res.status(400).json({ error: "No message provided" });
        }

        console.log("🤖 Sending to Gemini...");
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}`);
        const geoData = await geoRes.json();
        const address = geoData.display_name;

        const fullPrompt = `You are a helpful vaccination assistant. Answer the user's question about vaccinations, health, and send the  nearby medical facilities location based on the user's location.
        User question: ${message}
        location: ${address}`
        console.log(fullPrompt);


        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: fullPrompt,
            config: {
                thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
            }
        });

        console.log("✅ Response generated");

        res.json({
            reply: response.text
        });

    } catch (error) {
        console.error("❌ Chat Error:", error.message);
        console.error("❌ Full error:", error);
        res.status(500).json({ error: "Failed to process chat request", details: error.message });
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
            console.log(`   - POST /api/chat`);
            console.log(`   - POST /api/payment/initiate-payment`);
            console.log(`   - Auth routes: /api/auth/*`);
            console.log(`   - Children routes: /api/children/*`);
        });
    } catch (error) {
        console.error('❌ Server startup error:', error);
        process.exit(1);
    }
})();