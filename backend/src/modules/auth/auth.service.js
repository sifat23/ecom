import bcrypt from 'bcrypt';
import { prisma } from '../../config/db.js';
import { env } from '../../config/env.js';
import { AppError } from '../../utils/AppError.js';
import { randomToken, sha256 } from '../../utils/crypto.js';
import { sendMail } from '../../services/mailer.js';
import {
    passwordResetEmail,
    emailVerificationEmail,
} from '../../services/emailTemplates.js';
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

const BCRYPT_ROUNDS = 10;

/* ────────────────────────────────────────────────────────
 * Public user shape — the ONLY shape ever returned to clients
 * ──────────────────────────────────────────────────────── */

function toPublicUser(user) {
    if (!user) return null;
    return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        vendor: user.vendor
            ? {
                id: user.vendor.id,
                businessName: user.vendor.businessName,
                status: user.vendor.status,
                stripeOnboardingComplete: user.vendor.stripeOnboardingComplete,
            }
            : null,
    };
}

/* ────────────────────────────────────────────────────────
 * Private helpers
 * ──────────────────────────────────────────────────────── */

/**
 * Issues a fresh verification token, persists its hash, and emails the link.
 * The mail send is fire-and-forget; the DB write is awaited.
 */
async function sendVerificationEmail({ user, req }) {
    const rawToken = randomToken(32);
    const tokenHash = sha256(rawToken);
    const expiresAt = new Date(
        Date.now() + env.EMAIL_VERIFICATION_TTL_MIN * 60 * 1000
    );

    await prisma.user.update({
        where: { id: user.id },
        data: {
            emailVerificationTokenHash: tokenHash,
            emailVerificationExpiresAt: expiresAt,
            emailVerificationSentAt: new Date(),
        },
    });

    const verifyUrl = `${env.APP_URL}/verify-email/${rawToken}`;
    const tpl = emailVerificationEmail({
        firstName: user.firstName,
        verifyUrl,
        ttlMinutes: env.EMAIL_VERIFICATION_TTL_MIN,
    });

    sendMail({ to: user.email, ...tpl }).catch((err) => {
        import('../../config/logger.js').then(({ logger }) =>
            logger.error(`verification email failed for ${user.email}: ${err.message}`)
        );
    });
}

/* ────────────────────────────────────────────────────────
 * REGISTER
 * ──────────────────────────────────────────────────────── */

export async function register({ payload, req }) {
    const { email, password, firstName, lastName, phone, role = 'customer' } = payload;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        await logActivity({
            actorType: 'system',
            action: 'auth.register_conflict',
            entityType: 'user',
            entityId: existing.id,
            metadata: { email, attemptRole: role, existingRole: existing.role },
            req,
        });

        if (existing.role === 'vendor' && role === 'customer') {
            throw AppError.conflict('This email is already registered as a vendor account. Vendor and customer accounts cannot share the same email.');
        }
        if (existing.role === 'customer' && role === 'vendor') {
            throw AppError.conflict('This email is already registered as a customer account. Vendor and customer accounts cannot share the same email.');
        }
        throw AppError.conflict('An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // Customers do not need email verification — auto-verified on registration
    const isCustomer = role === 'customer';

    const user = await prisma.user.create({
        data: {
            email,
            passwordHash,
            firstName,
            lastName:  lastName || null,
            phone:     phone || null,
            role,
            emailVerified: isCustomer,
        },
        include: { vendor: true },
    });

    const accessToken = issueAccessToken({
        id: user.id,
        role: user.role,
        actorType: ACTOR.USER,
    });
    const refresh = await issueRefreshToken({
        actorType: ACTOR.USER,
        actorId: user.id,
        req,
    });

    await logActivity({
        actorType: 'user',
        actorId: user.id,
        action: 'auth.registered',
        entityType: 'user',
        entityId: user.id,
        metadata: { role: user.role },
        req,
    });

    // Only vendors require email verification; customers are verified immediately
    if (!isCustomer) {
        await sendVerificationEmail({ user, req });
    }

    return {
        user: toPublicUser(user),
        accessToken,
        refreshToken: refresh.token,
        refreshExpiresAt: refresh.expiresAt,
    };
}

/* ────────────────────────────────────────────────────────
 * LOGIN
 * ──────────────────────────────────────────────────────── */

export async function login({ payload, req }) {
    const { email, password, expectedRole } = payload;

    const user = await prisma.user.findUnique({
        where: { email },
        include: { vendor: true },
    });

    const generic = AppError.unauthorized('Invalid email or password');

    if (!user) {
        await logActivity({
            actorType: 'system',
            action: 'auth.login_failed',
            metadata: { email, reason: 'no_such_user' },
            req,
        });
        throw generic;
    }

    if (!user.isActive) {
        await logActivity({
            actorType: 'user',
            actorId: user.id,
            action: 'auth.login_failed',
            metadata: { reason: 'account_disabled' },
            req,
        });
        throw AppError.forbidden('Your account has been disabled');
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
        await logActivity({
            actorType: 'user',
            actorId: user.id,
            action: 'auth.login_failed',
            metadata: { reason: 'bad_password' },
            req,
        });
        throw generic;
    }

    // Role portal guard: enforce that vendors use vendor portal and customers use customer portal
    if (expectedRole && user.role !== expectedRole) {
        await logActivity({
            actorType: 'user',
            actorId: user.id,
            action: 'auth.login_role_mismatch',
            metadata: { userRole: user.role, expectedRole },
            req,
        });

        if (user.role === 'vendor') {
            throw AppError.forbidden('This email is registered as a vendor account. Please sign in via the Vendor Portal at /vendor/login.');
        }
        if (user.role === 'customer') {
            throw AppError.forbidden('This email is registered as a customer account. Please sign in via the Customer Portal at /login.');
        }
    }

    const updated = await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
        include: { vendor: true },
    });

    const accessToken = issueAccessToken({
        id: updated.id,
        role: updated.role,
        actorType: ACTOR.USER,
    });
    const refresh = await issueRefreshToken({
        actorType: ACTOR.USER,
        actorId: updated.id,
        req,
    });

    await logActivity({
        actorType: 'user',
        actorId: updated.id,
        action: 'auth.login',
        entityType: 'user',
        entityId: updated.id,
        req,
    });

    return {
        user: toPublicUser(updated),
        accessToken,
        refreshToken: refresh.token,
        refreshExpiresAt: refresh.expiresAt,
    };
}

/* ────────────────────────────────────────────────────────
 * GOOGLE AUTH (Customer + Vendor)
 * ──────────────────────────────────────────────────────── */

export async function googleAuth({ credential, role = 'customer', req }) {
    let googleUser = null;

    if (credential && credential.startsWith('dev_mock_')) {
        // Dev mock for testing without Google Cloud setup
        const email = credential.replace('dev_mock_', '').toLowerCase();
        googleUser = {
            email,
            email_verified: true,
            given_name: 'Test',
            family_name: 'User',
            sub: 'dev_sub_' + sha256(email).slice(0, 16),
        };
    } else {
        // Attempt verifying with Google API tokeninfo
        try {
            const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
            if (res.ok) {
                const data = await res.json();
                if (env.GOOGLE_CLIENT_ID && data.aud !== env.GOOGLE_CLIENT_ID) {
                    throw AppError.unauthorized('Google token audience mismatch');
                }
                googleUser = data;
            }
        } catch (err) {
            // If network fails or tokeninfo fails, check if dev mode allows decoding payload directly
            if (env.isDev) {
                try {
                    const parts = credential.split('.');
                    if (parts.length === 3) {
                        const payloadStr = Buffer.from(parts[1], 'base64url').toString('utf8');
                        const parsed = JSON.parse(payloadStr);
                        if (parsed.email) {
                            googleUser = parsed;
                        }
                    }
                } catch (_) {}
            }
        }
    }

    if (!googleUser || !googleUser.email) {
        throw AppError.unauthorized('Invalid or unverified Google token');
    }

    const email = googleUser.email.toLowerCase().trim();
    const firstName = googleUser.given_name || googleUser.name?.split(' ')[0] || 'User';
    const lastName = googleUser.family_name || (googleUser.name?.split(' ').slice(1).join(' ') || null);

    let user = await prisma.user.findUnique({
        where: { email },
        include: { vendor: true },
    });

    if (user) {
        // Enforce role exclusivity! A vendor cannot log in / register as customer, and vice-versa
        if (user.role !== role) {
            if (user.role === 'vendor') {
                throw AppError.forbidden(
                    'This email is registered as a vendor account. Please sign in via the Vendor Portal at /vendor/login.'
                );
            } else {
                throw AppError.forbidden(
                    'This email is registered as a customer account. Please sign in via the Customer Portal at /login.'
                );
            }
        }

        if (!user.isActive) {
            throw AppError.forbidden('Your account has been disabled');
        }

        // Ensure email is marked verified since it is verified by Google
        if (!user.emailVerified) {
            user = await prisma.user.update({
                where: { id: user.id },
                data: { emailVerified: true },
                include: { vendor: true },
            });
        }
    } else {
        // Create new user for this role
        const dummyPassword = await bcrypt.hash(randomToken(32), BCRYPT_ROUNDS);
        user = await prisma.user.create({
            data: {
                email,
                passwordHash: dummyPassword,
                firstName,
                lastName: lastName || null,
                role,
                emailVerified: true, // Google verifies emails
            },
            include: { vendor: true },
        });

        await logActivity({
            actorType: 'user',
            actorId: user.id,
            action: 'auth.google_registered',
            entityType: 'user',
            entityId: user.id,
            metadata: { role: user.role, email },
            req,
        });
    }

    const updated = await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
        include: { vendor: true },
    });

    const accessToken = issueAccessToken({
        id: updated.id,
        role: updated.role,
        actorType: ACTOR.USER,
    });
    const refresh = await issueRefreshToken({
        actorType: ACTOR.USER,
        actorId: updated.id,
        req,
    });

    await logActivity({
        actorType: 'user',
        actorId: updated.id,
        action: 'auth.google_login',
        entityType: 'user',
        entityId: updated.id,
        req,
    });

    return {
        user: toPublicUser(updated),
        accessToken,
        refreshToken: refresh.token,
        refreshExpiresAt: refresh.expiresAt,
    };
}

/* ────────────────────────────────────────────────────────
 * REFRESH (rotation)
 * ──────────────────────────────────────────────────────── */

export async function refresh({ rawRefreshToken, req }) {
    const oldRow = await verifyRefreshToken(rawRefreshToken, ACTOR.USER);

    const user = await prisma.user.findUnique({
        where: { id: oldRow.actorId },
        include: { vendor: true },
    });
    if (!user || !user.isActive) {
        await revokeRefreshToken(rawRefreshToken);
        throw AppError.unauthorized('Account unavailable');
    }

    const next = await rotateRefreshToken({ oldTokenRow: oldRow, req });

    const accessToken = issueAccessToken({
        id: user.id,
        role: user.role,
        actorType: ACTOR.USER,
    });

    return {
        user: toPublicUser(user),
        accessToken,
        refreshToken: next.token,
        refreshExpiresAt: next.expiresAt,
    };
}

/* ────────────────────────────────────────────────────────
 * LOGOUT
 * ──────────────────────────────────────────────────────── */

export async function logout({ rawRefreshToken, user, req }) {
    if (rawRefreshToken) {
        await revokeRefreshToken(rawRefreshToken);
    }
    if (user) {
        await logActivity({
            actorType: 'user',
            actorId: user.id,
            action: 'auth.logout',
            entityType: 'user',
            entityId: user.id,
            req,
        });
    }
}

/* ────────────────────────────────────────────────────────
 * GET ME
 * ──────────────────────────────────────────────────────── */

export async function getMe(userId) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { vendor: true },
    });
    if (!user || !user.isActive) throw AppError.unauthorized('Account unavailable');
    return toPublicUser(user);
}

/* ────────────────────────────────────────────────────────
 * FORGOT PASSWORD
 * ──────────────────────────────────────────────────────── */

export async function forgotPassword({ email, req }) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        await logActivity({
            actorType: 'system',
            action: 'auth.password_reset_requested',
            metadata: { email, exists: false },
            req,
        });
        return;
    }

    const rawToken = randomToken(32);
    const tokenHash = sha256(rawToken);
    const expiresAt = new Date(
        Date.now() + env.PASSWORD_RESET_TTL_MIN * 60 * 1000
    );

    await prisma.user.update({
        where: { id: user.id },
        data: {
            passwordResetTokenHash: tokenHash,
            passwordResetExpiresAt: expiresAt,
        },
    });

    const resetUrl = user.role === 'vendor'
        ? `${env.APP_URL}/vendor/reset-password/${rawToken}`
        : `${env.APP_URL}/reset-password/${rawToken}`;
    const tpl = passwordResetEmail({
        firstName: user.firstName,
        resetUrl,
        ttlMinutes: env.PASSWORD_RESET_TTL_MIN,
    });

    sendMail({ to: user.email, ...tpl }).catch((err) => {
        import('../../config/logger.js').then(({ logger }) =>
            logger.error(`password reset email failed: ${err.message}`)
        );
    });

    await logActivity({
        actorType: 'user',
        actorId: user.id,
        action: 'auth.password_reset_requested',
        entityType: 'user',
        entityId: user.id,
        metadata: { exists: true },
        req,
    });
}

/* ────────────────────────────────────────────────────────
 * RESET PASSWORD
 * ──────────────────────────────────────────────────────── */

export async function resetPassword({ token, newPassword, req }) {
    const tokenHash = sha256(token);

    const user = await prisma.user.findFirst({
        where: {
            passwordResetTokenHash: tokenHash,
            passwordResetExpiresAt: { gt: new Date() },
        },
    });

    if (!user) {
        throw AppError.badRequest('Reset link is invalid or has expired');
    }

    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            passwordHash,
            passwordResetTokenHash: null,
            passwordResetExpiresAt: null,
        },
    });

    await revokeAllForActor({ actorType: ACTOR.USER, actorId: user.id });

    await logActivity({
        actorType: 'user',
        actorId: user.id,
        action: 'auth.password_reset_completed',
        entityType: 'user',
        entityId: user.id,
        req,
    });
}

/* ────────────────────────────────────────────────────────
 * EMAIL VERIFICATION
 * ──────────────────────────────────────────────────────── */

/**
 * Verifies a token. Three outcomes:
 *   • valid    → flip emailVerified, clear token   (returns { verified: true })
 *   • expired  → 410 EMAIL_VERIFY_EXPIRED + email  (UI can offer resend)
 *   • invalid  → 410 EMAIL_VERIFY_INVALID          (used / bogus / tampered)
 */
export async function verifyEmail({ token, req }) {
    if (!token) throw AppError.badRequest('Missing verification token');

    const tokenHash = sha256(token);

    const user = await prisma.user.findFirst({
        where: { emailVerificationTokenHash: tokenHash },
    });

    if (!user) {
        throw new AppError(
            'This verification link is invalid or has already been used.',
            410,
            'EMAIL_VERIFY_INVALID'
        );
    }

    if (user.emailVerified) {
        return { verified: true, alreadyVerified: true, email: user.email };
    }

    if (
        !user.emailVerificationExpiresAt ||
        user.emailVerificationExpiresAt < new Date()
    ) {
        throw new AppError(
            'This verification link has expired.',
            410,
            'EMAIL_VERIFY_EXPIRED',
            { email: user.email }
        );
    }

    await prisma.user.update({
        where: { id: user.id },
        data: {
            emailVerified: true,
            emailVerificationTokenHash: null,
            emailVerificationExpiresAt: null,
        },
    });

    await logActivity({
        actorType: 'user',
        actorId: user.id,
        action: 'auth.email_verified',
        entityType: 'user',
        entityId: user.id,
        req,
    });

    return { verified: true, email: user.email };
}

/**
 * Issues a new verification email. Always returns a generic message —
 * never reveals whether the address exists or is already verified.
 */
export async function resendVerification({ email, req }) {
    const generic = {
        message:
            'If that email is registered and unverified, a new link has been sent.',
    };

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.emailVerified) return generic;

    const cooldownMs = env.EMAIL_VERIFICATION_RESEND_COOLDOWN_SEC * 1000;
    if (user.emailVerificationSentAt) {
        const elapsed = Date.now() - user.emailVerificationSentAt.getTime();
        if (elapsed < cooldownMs) {
            const retryAfterSec = Math.ceil((cooldownMs - elapsed) / 1000);
            throw new AppError(
                `Please wait ${retryAfterSec}s before requesting another verification email.`,
                429,
                'RESEND_COOLDOWN',
                { retryAfterSec }
            );
        }
    }

    await sendVerificationEmail({ user, req });

    await logActivity({
        actorType: 'user',
        actorId: user.id,
        action: 'auth.email_verification_resent',
        entityType: 'user',
        entityId: user.id,
        req,
    });

    return generic;
}