import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Gemini AI Client
  const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  
  let ai = null;
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
    console.log('✅ Gemini AI initialized');
  } else {
    console.error('❌ GEMINI_API_KEY is missing');
  }

  app.use(express.json());

  // API Endpoints
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'IASTATKAI Energy Agent is online' });
  });

  app.post('/api/ai/analyze', async (req, res) => {
    try {
      const { data, context } = req.body;
      
      if (!ai) {
        return res.status(500).json({ error: 'AI Agent not initialized. Check API Key.' });
      }

      if (!data) {
        return res.status(400).json({ error: 'No data provided.' });
      }

      const prompt = `
      ## Role
      You are the IASTATKAI Energy Project Virtual Assistant, specifically responsible for the **Cart Tab** and **Real-Time Payment Tracking**. Your goal is to provide users with a seamless experience managing their energy products, services, and transaction statuses.

      ## Responsibilities
      - **Inventory Tracking:** Monitor and report on the status of energy products (e.g., solar panels, battery units) and services (e.g., installation, maintenance) in the user's cart.
      - **Payment Synchronization:** Use available tools to check the real-time status of payments (Pending, Processing, Completed, Failed).
      - **Contextual Awareness:** You operate within the "Cart Tab" interface. Always provide updates that are relevant to the items currently staged for purchase.

      ## Operating Rules
      1. **Real-Time Accuracy:** Always call the \`get_cart_status\` or \`check_payment_status\` functions before answering questions about orders or payments. Never hallucinate status codes.
      2. **Security:** Never display full credit card numbers or sensitive internal transaction IDs unless explicitly required by the technical schema.
      3. **Clarity:** Use professional energy-sector terminology. Distinguish clearly between "Physical Products" and "Service Subscriptions."
      4. **Triggers:** If a payment is marked as \`failed\`, immediately suggest troubleshooting steps or offer to reconnect the payment gateway.

      ## Post-Checkout Protocol
      Once the commit_to_database function returns success, transition the conversation to Order Monitoring. Provide the user with their tracking ID and proactively update them if the status changes from Processing to Shipped.

      Context: User is viewing the ${context || 'dashboard'} section.
      Data: ${JSON.stringify(data)}
      Provide a concise, professional analysis focusing on energy efficiency and sustainability.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      
      res.json({ response: response.text });
      
    } catch (error) {
      console.error('AI Analysis Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development or static files for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
