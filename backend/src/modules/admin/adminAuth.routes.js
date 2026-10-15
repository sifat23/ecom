import { Router } from 'express';
import rateLimit from 'express-rate-limit';

import * as controller from './adminAuth.controller.js';
import { validate } from '../../middleware/validate.js';
import { requireAdmin, optionalAuth } from '../../middleware/auth.js';
import { env } from '../../config/env.js';
import { adminLoginSchema } from '../auth/auth.schemas.js';

const router = Router();

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

router.post('/login',   loginLimiter, validate(adminLoginSchema), controller.login);
router.post('/refresh', controller.refresh);
router.post('/logout',  controller.logout);
router.get ('/me',      requireAdmin, controller.me);

export default router;