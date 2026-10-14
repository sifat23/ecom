require('dotenv').config();

module.exports = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 3000,
    appUrl: process.env.APP_URL || 'http://localhost:5173',
    databaseUrl: process.env.DATABASE_URL,
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        accessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
        refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
    },
    smtp: {
        host: process.env.SMTP_HOST || 'mailpit',
        port: parseInt(process.env.SMTP_PORT, 10) || 1025,
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
        from: process.env.EMAIL_FROM || 'noreply@yourdomain.com',
    },
    storage: {
        driver: process.env.STORAGE_DRIVER || 'local',
        uploadDir: process.env.UPLOAD_DIR || '/app/uploads',
    },
};