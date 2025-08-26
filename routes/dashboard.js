const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Import our guard

// This route is protected. 
// The authMiddleware function will run BEFORE the (req, res) function.
router.get('/data', authMiddleware, (req, res) => {
    // Because the middleware ran, we have access to req.user
    res.json({ 
        message: `Welcome, user ${req.user.id}! Here is your secret data.` 
    });
});

// ... after the router.get('/data', ...) route ...

const { GoogleGenerativeAI } = require('@google/generative-ai');

// This is also a protected route
router.post('/generate', authMiddleware, async (req, res) => {
    try {
        // Get the topic from the request body
        const { topic } = req.body;
        if (!topic) {
            return res.status(400).json({ message: "Topic is required." });
        }

        // Initialize the AI client
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Explain the topic of "${topic}" for a beginner Node.js developer. Keep it concise and clear.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Send the AI-generated text back to the frontend
        res.json({ content: text });

    } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).json({ message: "Failed to generate content." });
    }
});

module.exports = router;