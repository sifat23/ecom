import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { env } from './config/env.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';
import healthRoutes from './modules/health/health.routes.js';

import cookieParser from 'cookie-parser';
import authRoutes from './modules/auth/auth.routes.js';
import adminAuthRoutes from './modules/admin/adminAuth.routes.js';

import vendorRoutes from './modules/vendors/vendor.routes.js';

export function createApp() {
    const app = express();

    app.disable('x-powered-by');
    app.set('trust proxy', 1); // behind nginx

    app.use(cors({
        origin: env.CORS_ORIGINS,
        credentials: true,
    }));

    app.use(morgan(env.isDev ? 'dev' : 'combined'));

    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({ extended: true, limit: '1mb' }));
    app.use(cookieParser());

    // ⚠️ Webhook routes need the RAW body for signature verification.
    //    Must be registered BEFORE express.json().
    app.use('/api/webhooks', express.raw({ type: 'application/json', limit: '1mb' }));

    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({ extended: true, limit: '1mb' }));

    // Dev-only static serving of uploads (nginx handles this in prod)
    if (!env.isProd) {
        app.use('/uploads', express.static(env.UPLOAD_DIR));
    }

    // ── Routes ────────────────────────────────────────────────
    app.use('/api', healthRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api/admin/auth', adminAuthRoutes);
    app.use('/api/vendors', vendorRoutes);

    // Phase 1+: mount the rest here
    // app.use('/api/auth',          authRoutes);
    // app.use('/api/admin/auth',    adminAuthRoutes);
    // app.use('/api/vendors',       vendorRoutes);
    // app.use('/api/products',      productRoutes);
    // app.use('/api/categories',    categoryRoutes);
    // app.use('/api/cart',          cartRoutes);
    // app.use('/api/checkout',      checkoutRoutes);
    // app.use('/api/orders',        orderRoutes);
    // app.use('/api/admin',         adminRoutes);
    // app.use('/api/webhooks',      webhookRoutes);

    app.use(notFound);
    app.use(errorHandler);

    return app;
}