import { prisma } from '../config/db.js';
import { logger } from '../config/logger.js';

/**
 * Universal audit logger. Never throws — a logging failure must not
 * break the business operation that triggered it.
 *
 * Called from the SERVICE layer, not controllers.
 */
export async function logActivity({
                                      actorType,
                                      actorId = null,
                                      action,
                                      entityType = null,
                                      entityId = null,
                                      metadata = null,
                                      req = null,
                                  }) {
    try {
        if (!['admin', 'user', 'system'].includes(actorType)) {
            throw new Error(`Invalid actorType: ${actorType}`);
        }

        await prisma.activity.create({
            data: {
                actorType,
                actorId,
                action,
                entityType,
                entityId,
                metadata: metadata ?? undefined,
                ipAddress: req?.ip ?? null,
                userAgent: req?.headers?.['user-agent']?.slice(0, 255) ?? null,
            },
        });
    } catch (err) {
        logger.error('activityLogger: failed to write activity', {
            action,
            actorType,
            actorId,
            error: err.message,
        });
    }
}

/** Convenience: log using the authenticated actor already on the request. */
export function logFromReq(req, { action, entityType, entityId, metadata }) {
    const actor = req.admin
        ? { actorType: 'admin', actorId: req.admin.id }
        : req.user
            ? { actorType: 'user', actorId: req.user.id }
            : { actorType: 'system', actorId: null };

    return logActivity({ ...actor, action, entityType, entityId, metadata, req });
}