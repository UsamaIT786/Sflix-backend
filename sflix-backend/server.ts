import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mediaRoutes from './routes/media.routes';
import streamRoutes from './routes/stream.routes';
import authRoutes from './routes/auth.routes';
import paymentRoutes from './routes/payment.routes';

// ─── Load environment variables ─────────────────────────────────
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '4000', 10);
const FRONTEND_ORIGIN =
  process.env.FRONTEND_ORIGIN || 'http://localhost:3001';

// ─── Middleware ──────────────────────────────────────────────────

// CORS — Allowed Origins (Local Development + Live Production)
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'https://novaplay.stream',
  FRONTEND_ORIGIN
].filter(Boolean); // Remove any undefined values

// Handle preflight OPTIONS requests
app.options('*', (req, res) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin as string)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(204);
});

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like curl/postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Tiny request logger (method + path + timestamp)
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`
  );
  next();
});

// ─── Health-check ───────────────────────────────────────────────
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    service: 'SFlix-Next Backend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ─── Routes ─────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/streams', streamRoutes);
app.use('/api/payments', paymentRoutes);

// ─── 404 catch-all ──────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found. See /api/health for available endpoints.',
  });
});

// ─── Global error handler ───────────────────────────────────────
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  // Axios / TMDB upstream errors
  const statusCode = err.response?.status || err.status || 500;
  const message =
    err.response?.data?.status_message ||
    err.message ||
    'Internal server error';

  console.error(`[ERROR] ${statusCode} — ${message}`);

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ─── Start server (only if not in Vercel environment) ────────────
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`\n  🎬  SFlix-Next Backend live on http://localhost:${PORT}`);
    console.log(`  🔗  Accepting requests from ${FRONTEND_ORIGIN}\n`);
  });
}

export default app;