import { AppError } from '../utils/AppError.js';
import { prisma } from '../config/db.js';
import { verifyAccessToken } from '../services/tokenService.js';

function readBearer(req) {
    const h = req.headers.authorization;
    if (!h || !h.startsWith('Bearer ')) return null;
    return h.slice(7).trim();
}

/* ────────────────────────────────────────────────────────
 * USER CONTEXT
 * ──────────────────────────────────────────────────────── */

/** Requires a valid access token with actorType: 'user'. Attaches `req.user`. */
export async function requireAuth(req, _res, next) {
    try {
        const token = readBearer(req);
        if (!token) throw AppError.unauthorized('Missing authorization header');

        const claims = verifyAccessToken(token);
        if (claims.actorType !== 'user') {
            throw AppError.forbidden('This endpoint requires a user token');
        }

        const user = await prisma.user.findUnique({
            where: { id: claims.sub },
            include: { vendor: true },
        });
        if (!user || !user.isActive) throw AppError.unauthorized('Account unavailable');

        req.user = user;
        next();
    } catch (err) { next(err); }
}

/** Same as requireAuth, but doesn't fail if there's no token — useful for /logout. */
export async function optionalAuth(req, _res, next) {
    try {
        const token = readBearer(req);
        if (!token) return next();
        const claims = verifyAccessToken(token);
        if (claims.actorType !== 'user') return next();
        const user = await prisma.user.findUnique({
            where: { id: claims.sub },
            include: { vendor: true },
        });
        if (user && user.isActive) req.user = user;
    } catch { /* swallow — optional */ }
    next();
}

/** Requires `req.user.role` to be in the allowed list. Use after requireAuth. */
export function requireRole(...roles) {
    return (req, _res, next) => {
        if (!req.user) return next(AppError.unauthorized());
        if (!roles.includes(req.user.role)) {
            return next(AppError.forbidden('Insufficient role'));
        }
        next();
    };
}

/** Requires an approved vendor. Use after requireAuth + requireRole('vendor'). */
export function requireVendorApproved(req, _res, next) {
    if (!req.user) return next(AppError.unauthorized());
    if (!req.user.vendor || req.user.vendor.status !== 'approved') {
        return next(AppError.forbidden('Vendor account is not approved'));
    }
    next();
}

/* ────────────────────────────────────────────────────────
 * ADMIN CONTEXT (completely separate)
 * ──────────────────────────────────────────────────────── */

export async function requireAdmin(req, _res, next) {
    try {
        const token = readBearer(req);
        if (!token) throw AppError.unauthorized('Missing authorization header');

        const claims = verifyAccessToken(token);
        if (claims.actorType !== 'admin') {
            throw AppError.forbidden('This endpoint requires an admin token');
        }

        const admin = await prisma.admin.findUnique({ where: { id: claims.sub } });
        if (!admin || !admin.isActive) throw AppError.unauthorized('Admin unavailable');

        req.admin = admin;
        next();
    } catch (err) { next(err); }
}

export function requireAdminRole(...roles) {
    return (req, _res, next) => {
        if (!req.admin) return next(AppError.unauthorized());
        if (!roles.includes(req.admin.role)) {
            return next(AppError.forbidden('Insufficient admin role'));
        }
        next();
    };
}