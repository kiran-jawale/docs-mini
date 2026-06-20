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

app.use(
  morgan(
    ':method :url | Status: :status | Size: :res[content-length] bytes | Time: :response-time ms | Date: :date[iso]',
    { stream: morganStream }
  )
);

app.use(express.static(path.resolve(__dirname, '../public')));

app.use(`${CONFIG.API_VERSION}/auth`, authRouter);
// app.use(`${CONFIG.API_VERSION}/seed`, seedRouter);

app.use(`${CONFIG.API_VERSION}/documents`, isVerified, documentRouter);
app.use(`${CONFIG.API_VERSION}/complaints`, isVerified, complaintRouter);
app.use(`${CONFIG.API_VERSION}/notices`, isVerified, noticeRouter);
app.use(`${CONFIG.API_VERSION}/analytics`, isVerified, analyticsRouter);
app.use(`${CONFIG.API_VERSION}/finance`, isVerified, financeRouter);
app.use(`${CONFIG.API_VERSION}/admin`, isVerified, adminRouter);
app.use(`${CONFIG.API_VERSION}/mod`, isVerified, modRouter);

if (CONFIG.SERVE_STATIC) {
  const clientPath = path.resolve(__dirname, '../dist');

  app.use(express.static(clientPath));
  
  app.get(/^(?!\/api\/v3).*/, (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
}

app.use(errorMiddleware);

export { app };