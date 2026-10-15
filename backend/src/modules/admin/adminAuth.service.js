import bcrypt from 'bcrypt';
import { prisma } from '../../config/db.js';
import { AppError } from '../../utils/AppError.js';
import { logActivity } from '../../services/activityLogger.js';
import {
    ACTOR,
    issueAccessToken,
    issueRefreshToken,
    verifyRefreshToken,
    rotateRefreshToken,
    revokeRefreshToken,
    revokeAllForActor,
} from '../../services/tokenService.js';
import { randomToken, sha256 } from '../../utils/crypto.js';
import { env } from '../../config/env.js';
import { passwordResetEmail } from '../../services/emailTemplates.js';
import { sendMail } from '../../services/mailer.js';
import { logger } from '../../config/logger.js';

function toPublicAdmin(admin) {
    if (!admin) return null;
    return {
        id: admin.id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role,
        createdAt: admin.createdAt,
    };
}

export async function login({ payload, req }) {
    const { email, password } = payload;

    const admin = await prisma.admin.findUnique({ where: { email } });
    const generic = AppError.unauthorized('Invalid email or password');

    if (!admin) {
        await logActivity({
            actorType: 'system',
            action: 'admin.auth.login_failed',
            metadata: { email, reason: 'no_such_admin' },
            req,
        });
        throw generic;
    }

    if (!admin.isActive) {
        await logActivity({
            actorType: 'admin',
            actorId: admin.id,
            action: 'admin.auth.login_failed',
            metadata: { reason: 'disabled' },
            req,
        });
        throw AppError.forbidden('Admin account disabled');
    }

    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) {
        await logActivity({
            actorType: 'admin',
            actorId: admin.id,
            action: 'admin.auth.login_failed',
            metadata: { reason: 'bad_password' },
            req,
        });
        throw generic;
    }

    const updated = await prisma.admin.update({
        where: { id: admin.id },
        data: { lastLoginAt: new Date() },
    });

    const accessToken = issueAccessToken({
        id: updated.id,
        role: updated.role,
        actorType: ACTOR.ADMIN,
    });
    const refresh = await issueRefreshToken({
        actorType: ACTOR.ADMIN,
        actorId: updated.id,
        req,
    });

    await logActivity({
        actorType: 'admin',
        actorId: updated.id,
        action: 'admin.auth.login',
        entityType: 'admin',
        entityId: updated.id,
        req,
    });

    return {
        admin: toPublicAdmin(updated),
        accessToken,
        refreshToken: refresh.token,
        refreshExpiresAt: refresh.expiresAt,
    };
}

export async function refresh({ rawRefreshToken, req }) {
    const oldRow = await verifyRefreshToken(rawRefreshToken, ACTOR.ADMIN);

    const admin = await prisma.admin.findUnique({ where: { id: oldRow.actorId } });
    if (!admin || !admin.isActive) {
        await revokeRefreshToken(rawRefreshToken);
        throw AppError.unauthorized('Admin unavailable');
    }

    const next = await rotateRefreshToken({ oldTokenRow: oldRow, req });

    const accessToken = issueAccessToken({
        id: admin.id,
        role: admin.role,
        actorType: ACTOR.ADMIN,
    });

    return {
        admin: toPublicAdmin(admin),
        accessToken,
        refreshToken: next.token,
        refreshExpiresAt: next.expiresAt,
    };
}

export async function logout({ rawRefreshToken, admin, req }) {
    if (rawRefreshToken) await revokeRefreshToken(rawRefreshToken);
    if (admin) {
        await logActivity({
            actorType: 'admin',
            actorId: admin.id,
            action: 'admin.auth.logout',
            entityType: 'admin',
            entityId: admin.id,
            req,
        });
    }
}

export async function getMe(adminId) {
    const admin = await prisma.admin.findUnique({ where: { id: adminId } });
    if (!admin || !admin.isActive) throw AppError.unauthorized('Admin unavailable');
    return toPublicAdmin(admin);
}

export async function forgotPassword({ email, req }) {
    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) {
        await logActivity({
            actorType: 'system',
            action: 'admin.auth.password_reset_requested',
            metadata: { email, exists: false },
            req,
        });
        return;
    }

    const rawToken = randomToken(32);
    const tokenHash = sha256(rawToken);
    const expiresAt = new Date(Date.now() + env.PASSWORD_RESET_TTL_MIN * 60 * 1000);

    await prisma.admin.update({
        where: { id: admin.id },
        data: {
            passwordResetTokenHash: tokenHash,
            passwordResetExpiresAt: expiresAt,
        },
    });

    const resetUrl = `${env.APP_URL}/admin/reset-password/${rawToken}`;
    const tpl = passwordResetEmail({
        firstName: admin.firstName,
        resetUrl,
        ttlMinutes: env.PASSWORD_RESET_TTL_MIN,
    });

    sendMail({ to: admin.email, ...tpl }).catch((err) => {
        logger.error(`admin password reset email failed: ${err.message}`);
    });

    await logActivity({
        actorType: 'admin',
        actorId: admin.id,
        action: 'admin.auth.password_reset_requested',
        entityType: 'admin',
        entityId: admin.id,
        metadata: { exists: true },
        req,
    });
}

export async function resetPassword({ token, newPassword, req }) {
    const tokenHash = sha256(token);

    const admin = await prisma.admin.findFirst({
        where: {
            passwordResetTokenHash: tokenHash,
            passwordResetExpiresAt: { gt: new Date() },
        },
    });

    if (!admin) {
        throw AppError.badRequest('Reset link is invalid or has expired');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.admin.update({
        where: { id: admin.id },
        data: {
            passwordHash,
            passwordResetTokenHash: null,
            passwordResetExpiresAt: null,
        },
    });

    await revokeAllForActor({ actorType: ACTOR.ADMIN, actorId: admin.id });

    await logActivity({
        actorType: 'admin',
        actorId: admin.id,
        action: 'admin.auth.password_reset_completed',
        entityType: 'admin',
        entityId: admin.id,
        req,
    });
}