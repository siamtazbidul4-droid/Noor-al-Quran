import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { apiRouter } from './src/server/apiRouter';
import { initDatabase } from './src/server/db';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

// Body and cookie parsing
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());

// Security headers and CORS
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // CORS headers: respect APP_URL in production, restrict otherwise
  const allowedOrigin = process.env.APP_URL || (isProd ? undefined : req.get('origin'));
  if (allowedOrigin) {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// REST API v1
app.use('/api/v1', apiRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', time: new Date().toISOString() });
});

async function startServer() {
  // Initialize Database (if MONGODB_URI configured)
  await initDatabase();

  if (!isProd) {
    // Development mode: attach Vite middleware
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: serve built assets
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[Noor Al-Quran Server] Running on http://0.0.0.0:${port}`);
  });
}

startServer().catch(err => {
  console.error('[Noor Al-Quran Server] Startup error:', err);
  process.exit(1);
});
