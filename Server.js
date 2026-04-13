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

      const prompt = `Act as an IASTATKAI Renewable Energy Expert. 
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
