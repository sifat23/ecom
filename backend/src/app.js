const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const env = require('./config/env');
const prisma = require('./config/db');
const logger = require('./utils/logger');
const AppError = require('./utils/AppError');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Trust Nginx reverse proxy
app.set('trust proxy', 1);

// Middleware
app.use(cors({ origin: env.appUrl, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP request logging via Morgan -> Winston
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms', {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

// Health Check Endpoint (accessible directly at /health or via Nginx /api/health)
const healthHandler = async (req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      success: true,
      status: 'ok',
      environment: env.nodeEnv,
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(new AppError('Database connection failed', 503, 'DB_CONNECTION_ERROR'));
  }
};

app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

// 404 Handler
app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404, 'NOT_FOUND'));
});

// Centralized Error Handler
app.use(errorHandler);

module.exports = app;
