import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { prisma } from './config/db.js';
import { verifyMailer } from './services/mailer.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
    logger.info(`api: listening on :${env.PORT} [${env.NODE_ENV}]`);
    verifyMailer();
});

async function shutdown(signal) {
    logger.info(`api: ${signal} received — shutting down gracefully`);
    server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
    });
    // Force exit if it hangs
    setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
    logger.error('unhandledRejection', { reason: String(reason) });
});
process.on('uncaughtException', (err) => {
    logger.error('uncaughtException', { message: err.message, stack: err.stack });
    shutdown('uncaughtException');
});
