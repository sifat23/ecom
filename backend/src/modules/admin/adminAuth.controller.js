import * as adminAuthService from './adminAuth.service.js';
import { env } from '../../config/env.js';
import {
    setAdminRefreshCookie,
    clearAdminRefreshCookie,
} from '../auth/auth.controller.js';

export async function login(req, res, next) {
    try {
        const result = await adminAuthService.login({ payload: req.body, req });
        setAdminRefreshCookie(res, result.refreshToken, result.refreshExpiresAt);
        res.json({
            success: true,
            data: { admin: result.admin, accessToken: result.accessToken },
        });
    } catch (err) { next(err); }
}

export async function refresh(req, res, next) {
    try {
        const raw = req.cookies[env.REFRESH_COOKIE_ADMIN];
        const result = await adminAuthService.refresh({ rawRefreshToken: raw, req });
        setAdminRefreshCookie(res, result.refreshToken, result.refreshExpiresAt);
        res.json({
            success: true,
            data: { admin: result.admin, accessToken: result.accessToken },
        });
    } catch (err) { next(err); }
}

export async function logout(req, res, next) {
    try {
        const raw = req.cookies[env.REFRESH_COOKIE_ADMIN];
        await adminAuthService.logout({ rawRefreshToken: raw, admin: req.admin ?? null, req });
        clearAdminRefreshCookie(res);
        res.json({ success: true, data: { message: 'Logged out' } });
    } catch (err) { next(err); }
}

export async function me(req, res, next) {
    try {
        const admin = await adminAuthService.getMe(req.admin.id);
        res.json({ success: true, data: { admin } });
    } catch (err) { next(err); }
}

export async function forgotPassword(req, res, next) {
    try {
        await adminAuthService.forgotPassword({ email: req.body.email, req });
        res.json({
            success: true,
            data: { message: 'If an admin account exists for that email, a password reset link has been sent.' },
        });
    } catch (err) { next(err); }
}

export async function resetPassword(req, res, next) {
    try {
        await adminAuthService.resetPassword({
            token: req.body.token,
            newPassword: req.body.newPassword,
            req,
        });
        res.json({ success: true, data: { message: 'Password updated. You can now sign in with your new password.' } });
    } catch (err) { next(err); }
}