import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

// 1. Load environment variables early
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // 2. Initialize Gemini AI Client
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

  // 3. Middleware
  // CRITICAL: Required to parse JSON payload from the frontend
  app.use(express.json()); 

  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

  // 4. API Endpoints (Must be above the React catch-all route)
  app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'IASTATKAI Energy Agent is online' });
  });

  app.post("/api/ai/analyze", async (req, res) => {
    try {
      const { data, context } = req.body;
      
      // Basic validation
      if (!data) {
        return res.status(400).json({ error: "No data provided for analysis." });
      }

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Tailored prompt for the IASTATKAI energy domain
      const prompt = `Act as an IASTATKAI Renewable Energy Expert. 
      Context: User is viewing the ${context || 'app'} section.
      User Query/Data: ${JSON.stringify(data)}
      
      Provide a helpful, professional, and concise response focusing on renewable energy, efficiency, and sustainability.`;

      const result = await model.generateContent(prompt);
      res.json({ response: result.response.text() });
      
    } catch (error) {
      console.error("AI Analysis Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // 5. Vite middleware for development or static files for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
    } else {
      console.warn(`Warning: dist directory not found at ${distPath}`);
    }
    
    // Catch-all: Route remaining requests to React App
    app.get('*', (req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Application is building or dist/index.html is missing.');
      }
    });
  }

  // 7. Server Initialization & Error Handling
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });

  server.on('error', (error) => {
    console.error('Server error:', error);
  });
}

startServer();

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});