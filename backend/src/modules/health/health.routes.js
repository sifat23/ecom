import { Router } from 'express';
import { prisma } from '../../config/db.js';
import { env } from '../../config/env.js';

const router = Router();

router.get('/health', async (_req, res) => {
    let db = 'ok';
    try {
        await prisma.$queryRaw`SELECT 1`;
    } catch {
        db = 'down';
    }

    const healthy = db === 'ok';

    res.status(healthy ? 200 : 503).json({
        success: healthy,
        data: {
            status: healthy ? 'ok' : 'degraded',
            db,
            env: env.NODE_ENV,
            uptime: Math.round(process.uptime()),
            timestamp: new Date().toISOString(),
        },
    });
});

export default router;