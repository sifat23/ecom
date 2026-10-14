const prisma = require('../config/db');
const logger = require('../utils/logger');

async function logActivity({ actorType, actorId, action, entityType, entityId, metadata = {}, req }) {
  try {
    await prisma.activity.create({
      data: {
        actorType,
        actorId: actorId || null,
        action,
        entityType: entityType || null,
        entityId: entityId || null,
        metadata,
        ipAddress: req?.ip || req?.connection?.remoteAddress || null,
        userAgent: req?.headers?.['user-agent'] || null,
      },
    });
  } catch (err) {
    logger.error(`Failed to write activity log for action ${action}: ${err.message}`);
  }
}

module.exports = { logActivity };
