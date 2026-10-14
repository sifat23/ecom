const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const code = err.code || 'INTERNAL_SERVER_ERROR';
    const message = err.message || 'Something went wrong';

    if (statusCode >= 500) {
        logger.error(`${req.method} ${req.originalUrl} - ${message}`, { stack: err.stack });
    } else {
        logger.warn(`${req.method} ${req.originalUrl} - ${statusCode} - ${message}`);
    }

    res.status(statusCode).json({
        success: false,
        error: {
            code,
            message,
            ...(err.details && { details: err.details }),
            ...(process.env.NODE_ENV === 'development' && statusCode >= 500 && { stack: err.stack }),
        },
    });
};

module.exports = errorHandler;
