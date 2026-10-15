import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from '../config/db.js';
import { randomToken, sha256 } from '../utils/crypto.js';
import { AppError } from '../utils/AppError.js';

const ACTOR = { USER: 'user', ADMIN: 'admin' };

/* ────────────────────────────────────────────────────────
 * ACCESS TOKENS (stateless JWT, short-lived)
 * ──────────────────────────────────────────────────────── */

/**
 * @param {{ id: string, role: string, actorType: 'user'|'admin' }} actor
 */
export function issueAccessToken(actor) {
    return jwt.sign(
        {
            sub: actor.id,
            actorType: actor.actorType,
            role: actor.role,
        },
        env.JWT_ACCESS_SECRET,
        { expiresIn: env.JWT_ACCESS_EXPIRY }
    );
}

/**
 * Throws AppError.unauthorized() on any problem — callers just catch.
 * @returns {{ sub: string, actorType: 'user'|'admin', role: string }}
 */
export function verifyAccessToken(token) {
    try {
        return jwt.verify(token, env.JWT_ACCESS_SECRET);
    } catch {
        throw AppError.unauthorized('Invalid or expired access token');
    }
}

/* ────────────────────────────────────────────────────────
 * REFRESH TOKENS (opaque, hashed in DB, rotating)
 * ──────────────────────────────────────────────────────── */

/**
 * Creates a fresh refresh token. Returns both:
 *  - `token` (raw) → send to client
 *  - `id` (db id)  → keep to link replacement chain
 */
export async function issueRefreshToken({ actorType, actorId, req }) {
    const raw = randomToken(32);
    const tokenHash = sha256(raw);
    const expiresAt = new Date(Date.now() + parseExpiry(env.JWT_REFRESH_EXPIRY));

    const row = await prisma.refreshToken.create({
        data: {
            tokenHash,
            actorType,
            actorId,
            expiresAt,
            ipAddress: req?.ip ?? null,
            userAgent: req?.headers?.['user-agent']?.slice(0, 255) ?? null,
        },
    });

    return { token: raw, id: row.id, expiresAt };
}

/**
 * Verifies a raw refresh token, returns the DB row.
 * Enforces: exists, not revoked, not expired.
 */
export async function verifyRefreshToken(rawToken, expectedActorType) {
    if (!rawToken) throw AppError.unauthorized('Missing refresh token');

    const tokenHash = sha256(rawToken);
    const row = await prisma.refreshToken.findUnique({ where: { tokenHash } });

    if (!row) throw AppError.unauthorized('Invalid refresh token');
    if (row.actorType !== expectedActorType) {
        throw AppError.unauthorized('Refresh token does not belong to this context');
    }
    if (row.revokedAt) {
        // Token reuse detected → revoke every active refresh for this actor.
        await prisma.refreshToken.updateMany({
            where: { actorType: row.actorType, actorId: row.actorId, revokedAt: null },
            data: { revokedAt: new Date() },
        });
        throw AppError.unauthorized('Refresh token has been revoked');
    }
    if (row.expiresAt < new Date()) {
        throw AppError.unauthorized('Refresh token has expired');
    }

    return row;
}

/** Rotation: revoke the old token and issue a new one, linked via replacedBy. */
export async function rotateRefreshToken({ oldTokenRow, req }) {
    const next = await issueRefreshToken({
        actorType: oldTokenRow.actorType,
        actorId: oldTokenRow.actorId,
        req,
    });

    await prisma.refreshToken.update({
        where: { id: oldTokenRow.id },
        data: { revokedAt: new Date(), replacedBy: next.id },
    });

    return next;
}

/** Revoke a single refresh token (used by logout). */
export async function revokeRefreshToken(rawToken) {
    if (!rawToken) return;
    const tokenHash = sha256(rawToken);
    await prisma.refreshToken.updateMany({
        where: { tokenHash, revokedAt: null },
        data: { revokedAt: new Date() },
    });
}

/** Revoke all active refresh tokens for an actor (used by password reset). */
export async function revokeAllForActor({ actorType, actorId }) {
    await prisma.refreshToken.updateMany({
        where: { actorType, actorId, revokedAt: null },
        data: { revokedAt: new Date() },
    });
}

/* ────────────────────────────────────────────────────────
 * Helpers
 * ──────────────────────────────────────────────────────── */

/** '15m' / '7d' / '12h' → milliseconds */
function parseExpiry(str) {
    const m = /^(\d+)([smhd])$/.exec(str);
    if (!m) throw new Error(`Invalid expiry format: ${str}`);
    const n = parseInt(m[1], 10);
    switch (m[2]) {
        case 's': return n * 1000;
        case 'm': return n * 60 * 1000;
        case 'h': return n * 60 * 60 * 1000;
        case 'd': return n * 24 * 60 * 60 * 1000;
    }
}

export { ACTOR };