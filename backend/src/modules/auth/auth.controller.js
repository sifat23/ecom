import * as authService from './auth.service.js';
import { env } from '../../config/env.js';

/* ────────────────────────────────────────────────────────
 * Refresh cookie helpers
 * ──────────────────────────────────────────────────────── */

const REFRESH_PATH_USER  = '/api/auth';
const REFRESH_PATH_ADMIN = '/api/admin/auth';

export function setUserRefreshCookie(res, token, expiresAt) {
    res.cookie(env.REFRESH_COOKIE_USER, token, {
        httpOnly: true,
        secure: env.COOKIE_SECURE,
        sameSite: 'lax',
        domain: env.COOKIE_DOMAIN,
        path: REFRESH_PATH_USER,
        expires: expiresAt,
    });
}

export function clearUserRefreshCookie(res) {
    res.clearCookie(env.REFRESH_COOKIE_USER, {
        httpOnly: true,
        secure: env.COOKIE_SECURE,
        sameSite: 'lax',
        domain: env.COOKIE_DOMAIN,
        path: REFRESH_PATH_USER,
    });
}

export function setAdminRefreshCookie(res, token, expiresAt) {
    res.cookie(env.REFRESH_COOKIE_ADMIN, token, {
        httpOnly: true,
        secure: env.COOKIE_SECURE,
        sameSite: 'lax',
        domain: env.COOKIE_DOMAIN,
        path: REFRESH_PATH_ADMIN,
        expires: expiresAt,
    });
}

export function clearAdminRefreshCookie(res) {
    res.clearCookie(env.REFRESH_COOKIE_ADMIN, {
        httpOnly: true,
        secure: env.COOKIE_SECURE,
        sameSite: 'lax',
        domain: env.COOKIE_DOMAIN,
        path: REFRESH_PATH_ADMIN,
    });
}

/* ────────────────────────────────────────────────────────
 * Handlers
 * ──────────────────────────────────────────────────────── */

export async function register(req, res, next) {
    try {
        const result = await authService.register({ payload: req.body, req });
        setUserRefreshCookie(res, result.refreshToken, result.refreshExpiresAt);
        res.status(201).json({
            success: true,
            data: { user: result.user, accessToken: result.accessToken },
        });
    } catch (err) { next(err); }
}

export async function login(req, res, next) {
    try {
        const result = await authService.login({ payload: req.body, req });
        setUserRefreshCookie(res, result.refreshToken, result.refreshExpiresAt);
        res.json({
            success: true,
            data: { user: result.user, accessToken: result.accessToken },
        });
    } catch (err) { next(err); }
}

export async function google(req, res, next) {
    try {
        const result = await authService.googleAuth({
            credential: req.body.credential,
            role: req.body.role,
            req,
        });
        setUserRefreshCookie(res, result.refreshToken, result.refreshExpiresAt);
        res.json({
            success: true,
            data: { user: result.user, accessToken: result.accessToken },
        });
    } catch (err) { next(err); }
}

export async function refresh(req, res, next) {
    try {
        const rawRefreshToken = req.cookies[env.REFRESH_COOKIE_USER];
        const result = await authService.refresh({ rawRefreshToken, req });
        setUserRefreshCookie(res, result.refreshToken, result.refreshExpiresAt);
        res.json({
            success: true,
            data: { user: result.user, accessToken: result.accessToken },
        });
    } catch (err) { next(err); }
}

export async function logout(req, res, next) {
    try {
        const rawRefreshToken = req.cookies[env.REFRESH_COOKIE_USER];
        // `req.user` is populated by requireAuth, but logout is allowed
        // without a valid access token — pass through whatever's there.
        await authService.logout({ rawRefreshToken, user: req.user ?? null, req });
        clearUserRefreshCookie(res);
        res.json({ success: true, data: { message: 'Logged out' } });
    } catch (err) { next(err); }
}

export async function me(req, res, next) {
    try {
        const user = await authService.getMe(req.user.id);
        res.json({ success: true, data: { user } });
    } catch (err) { next(err); }
}

export async function forgotPassword(req, res, next) {
    try {
        await authService.forgotPassword({ email: req.body.email, req });
        res.json({
            success: true,
            data: { message: 'If that email is registered, a reset link has been sent.' },
        });
    } catch (err) { next(err); }
}

export async function resetPassword(req, res, next) {
    try {
        await authService.resetPassword({
            token: req.body.token,
            newPassword: req.body.newPassword,
            req,
        });
        res.json({ success: true, data: { message: 'Password reset successful' } });
    } catch (err) { next(err); }
}

export async function verifyEmail(req, res, next) {
    try {
        const result = await authService.verifyEmail({ token: req.body.token, req });
        res.json({ success: true, data: result });
    } catch (err) { next(err); }
}

export async function resendVerification(req, res, next) {
    try {
        const result = await authService.resendVerification({ email: req.body.email, req });
        res.json({ success: true, data: result });
    } catch (err) { next(err); }
}