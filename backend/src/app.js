import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import CONFIG from './constants/config.js';
import { morganStream } from './utils/metricsLogger.js';
import errorMiddleware from './middlewares/error.middleware.js';

import authRouter from './routes/auth.route.js';
import documentRouter from './routes/document.route.js';
import adminRouter from './routes/admin.route.js';
import modRouter from './routes/mod.route.js';
import complaintRouter from './routes/complaint.route.js';
import analyticsRouter from './routes/analytics.route.js';
import noticeRouter from './routes/notice.route.js';
import financeRouter from './routes/finance.route.js';
import seedRouter from './routes/seed.route.js';
import { isVerified } from './middlewares/auth.middleware.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Core Middlewares
if (!CONFIG.SERVE_STATIC) {
  app.use(
    cors({
      origin: CONFIG.CORS_ORIGIN,
      credentials: true,
    })
  );
}

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());

// 2. Global Request Logging via Morgan
app.use(
  morgan(
    ':method :url | Status: :status | Size: :res[content-length] bytes | Time: :response-time ms | Date: :date[iso]',
    { stream: morganStream }
  )
);

// Ensuring public/uploads are served from outside the src directory
app.use(express.static(path.resolve(__dirname, '../public')));

// 3. API Routing (Public)
app.use(`${CONFIG.API_VERSION}/auth`, authRouter);
// app.use(`${CONFIG.API_VERSION}/seed`, seedRouter);

// 4. API Routing (Protected)
// FIX 1: Apply `isVerified` strictly to API routes so it doesn't block the React frontend
app.use(`${CONFIG.API_VERSION}/documents`, isVerified, documentRouter);
app.use(`${CONFIG.API_VERSION}/complaints`, isVerified, complaintRouter);
app.use(`${CONFIG.API_VERSION}/notices`, isVerified, noticeRouter);
app.use(`${CONFIG.API_VERSION}/analytics`, isVerified, analyticsRouter);
app.use(`${CONFIG.API_VERSION}/finance`, isVerified, financeRouter);
app.use(`${CONFIG.API_VERSION}/admin`, isVerified, adminRouter);
app.use(`${CONFIG.API_VERSION}/mod`, isVerified, modRouter);

// 5. Serve Static React Production Build
if (CONFIG.SERVE_STATIC) {
  // FIX 2: Pointed to `../dist` because Vite outputs to the project root, not inside `src`
  const clientPath = path.resolve(__dirname, '../dist');

  app.use(express.static(clientPath));
  
  // Catch-all route to hand off routing to React Router DOM
  app.get(/^(?!\/api\/v3).*/, (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
}

app.use(errorMiddleware);

export { app };