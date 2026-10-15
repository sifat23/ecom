import dotenv from 'dotenv';
dotenv.config();

const bool = (v, fallback = false) =>
    v === undefined ? fallback : ['1', 'true', 'yes'].includes(String(v).toLowerCase());

const int = (v, fallback) => (v === undefined || v === '' ? fallback : parseInt(v, 10));

const list = (v, fallback = []) =>
    v ? v.split(',').map((s) => s.trim()).filter(Boolean) : fallback;

export const env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: int(process.env.PORT, 3000),
    APP_URL: process.env.APP_URL || 'http://localhost:5173',
    CORS_ORIGINS: list(process.env.CORS_ORIGINS, ['http://localhost:5173', 'http://localhost']),

    DATABASE_URL: process.env.DATABASE_URL,

    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY || '15m',
    JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || '7d',

    // Cookie settings
    COOKIE_DOMAIN: process.env.COOKIE_DOMAIN || undefined, // leave undefined for localhost
    COOKIE_SECURE: bool(process.env.COOKIE_SECURE, false), // force secure in prod via env
    REFRESH_COOKIE_USER:  process.env.REFRESH_COOKIE_USER  || 'mp_rt_user',
    REFRESH_COOKIE_ADMIN: process.env.REFRESH_COOKIE_ADMIN || 'mp_rt_admin',

    // Password reset
    PASSWORD_RESET_TTL_MIN: int(process.env.PASSWORD_RESET_TTL_MIN, 60),

    // Email verification (NEW)
    EMAIL_VERIFICATION_TTL_MIN:              int(process.env.EMAIL_VERIFICATION_TTL_MIN, 15),
    EMAIL_VERIFICATION_RESEND_COOLDOWN_SEC:  int(process.env.EMAIL_VERIFICATION_RESEND_COOLDOWN_SEC, 60),

    // Google OAuth
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || undefined,

    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    PLATFORM_FEE_PERCENTAGE: Number(process.env.PLATFORM_FEE_PERCENTAGE || 10),

    SHIPPO_API_KEY: process.env.SHIPPO_API_KEY,

    SMTP_HOST: process.env.SMTP_HOST || 'mailpit',
    SMTP_PORT: int(process.env.SMTP_PORT, 1025),
    SMTP_USER: process.env.SMTP_USER || undefined,
    SMTP_PASS: process.env.SMTP_PASS || undefined,
    EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@marketplace.local',

    STORAGE_DRIVER: process.env.STORAGE_DRIVER || 'local',
    UPLOAD_DIR: process.env.UPLOAD_DIR || '/app/uploads',

    isDev: (process.env.NODE_ENV || 'development') !== 'production',
    isProd: process.env.NODE_ENV === 'production',
};

// Fail fast on things that must exist
const REQUIRED = [
    'DATABASE_URL',
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET',
];
const missing = REQUIRED.filter((k) => !env[k]);
if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
}

if (env.isProd && !env.COOKIE_SECURE) {
    throw new Error('COOKIE_SECURE must be true in production.');
}

if (env.isProd && env.SMTP_HOST === 'mailpit') {
    throw new Error('SMTP_HOST=mailpit is not allowed in production.');
}