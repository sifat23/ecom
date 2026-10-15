import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Redirects already-authenticated users away from guest-only pages
 * (login, register, forgot-password, admin/login) to the page that
 * matches their current session.
 *
 * @param {{ context?: 'user' | 'admin' }} props
 *   - 'user'  (default) → guards /login, /register, /forgot-password, …
 *   - 'admin'           → guards /admin/login only (checks admin session only)
 */
export default function GuestRoute({ context = 'user' }) {
    const auth = useSelector((s) => s.auth);

    // Wait for the silent /auth/refresh on app boot to settle.
    // Otherwise a hard-refresh on /login by a logged-in user would
    // flash the login form before being bounced.
    if (!auth.bootstrapped) {
        return (
            <div className="min-h-screen flex items-center justify-center text-on-surface-variant">
                Loading…
            </div>
        );
    }

    /* ── Admin context: only check admin session ──────────── */
    if (context === 'admin') {
        if (auth.isAdminAuthenticated) {
            return <Navigate to="/admin/dashboard" replace />;
        }
        return <Outlet />;
    }

    /* ── User context: customer OR vendor ─────────────────── */
    if (auth.isAuthenticated) {
        const user = auth.user;

        if (user?.role === 'vendor') {
            const status = user.vendor?.status;
            if (status === 'approved') return <Navigate to="/vendor/dashboard" replace />;
            if (status === 'rejected') return <Navigate to="/vendor/rejected"  replace />;
            // pending / suspended / no vendor profile yet
            return <Navigate to="/vendor/pending" replace />;
        }

        // customer (or any non-vendor user role)
        return <Navigate to="/account" replace />;
    }

    // No session → render the guest page
    return <Outlet />;
}