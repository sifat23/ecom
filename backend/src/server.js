const app = require('./app');
const env = require('./config/env');
const logger = require('./utils/logger');
const prisma = require('./config/db');

const server = app.listen(env.port, () => {
  logger.info(`Backend server running in ${env.nodeEnv} mode on port ${env.port}`);
});

const shutdown = async () => {
  logger.info('Shutting down server...');
  await prisma.$disconnect();
  server.close(() => process.exit(0));
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
