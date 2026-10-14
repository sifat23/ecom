import { AppError } from '../utils/AppError.js';
import { logger } from '../config/logger.js';
import { env } from '../config/env.js';

export function errorHandler(err, req, res, _next) {
    const isApp = err instanceof AppError || err.isOperational;

    const statusCode = isApp ? err.statusCode : 500;
    const code = isApp ? err.code : 'INTERNAL_ERROR';
    const message = isApp ? err.message : 'Something went wrong';

    if (statusCode >= 500) {
        logger.error(`${req.method} ${req.originalUrl} — ${err.message}`, { stack: err.stack });
    } else if (env.isDev) {
        logger.debug(`${req.method} ${req.originalUrl} → ${statusCode} ${code}`);
    }

    res.status(statusCode).json({
        success: false,
        error: {
            code,
            message,
            ...(err.details ? { details: err.details } : {}),
            ...(env.isDev && !isApp ? { stack: err.stack } : {}),
        },
    });
}