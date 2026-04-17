const express = require('express');
const dotenv = require('dotenv');
const { processEnergyQuery } = require('./aiservice');

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

/**
 * IASTATKAI Energy API Endpoint
 * POST /api/ask
 */
app.post('/api/ask', async (req, res) => {
    try {
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({ 
                error: "Please provide a 'query' field in the request body." 
            });
        }

        // Call the AI Service layer
        const result = await processEnergyQuery(query);
        
        res.status(200).json(result);
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Internal server error occurred." });
    }
});

// Root Route
app.get('/', (req, res) => {
    res.send("IASTATKAI Energy AI Backend is Online.");
});

app.listen(PORT, () => {
    console.log(`🚀 IASTATKAI Server running at http://localhost:${PORT}`);
});