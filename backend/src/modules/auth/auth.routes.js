import { Router } from 'express';
import rateLimit from 'express-rate-limit';

import * as controller from './auth.controller.js';
import { validate } from '../../middleware/validate.js';
import { requireAuth, optionalAuth } from '../../middleware/auth.js';
import { env } from '../../config/env.js';
import {
    registerSchema,
    loginSchema,
    googleAuthSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    verifyEmailSchema,
    resendVerificationSchema,
} from './auth.schemas.js';

const router = Router();

/* ────────────────────────────────────────────────────────
 * Rate limiters
 * ──────────────────────────────────────────────────────── */

const loginLimiter = rateLimit({
    windowMs: 60_000,
    max: env.isDev ? 200 : 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: { code: 'RATE_LIMITED', message: 'Too many attempts, try again shortly' },
    },
});

const forgotLimiter = rateLimit({
    windowMs: 60 * 60_000,
    max: env.isDev ? 200 : 3,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: { code: 'RATE_LIMITED', message: 'Too many requests, try again later' },
    },
});

const verifyLimiter = rateLimit({
    windowMs: 15 * 60_000,
    max: env.isDev ? 200 : 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: { code: 'RATE_LIMITED', message: 'Too many attempts, try again shortly' },
    },
});

/* ────────────────────────────────────────────────────────
 * Routes
 * ──────────────────────────────────────────────────────── */

router.post('/register',         loginLimiter, validate(registerSchema),    controller.register);
router.post('/login',            loginLimiter, validate(loginSchema),       controller.login);
router.post('/google',           loginLimiter, validate(googleAuthSchema),  controller.google);
router.post('/refresh',          controller.refresh);
router.post('/logout',           optionalAuth, controller.logout);
router.get ('/me',               requireAuth, controller.me);

router.post('/forgot-password',  forgotLimiter, validate(forgotPasswordSchema), controller.forgotPassword);
router.post('/reset-password',   loginLimiter, validate(resetPasswordSchema),  controller.resetPassword);

router.post('/verify-email',         verifyLimiter, validate(verifyEmailSchema),         controller.verifyEmail);
router.post('/resend-verification',  forgotLimiter, validate(resendVerificationSchema),  controller.resendVerification);

export default router;