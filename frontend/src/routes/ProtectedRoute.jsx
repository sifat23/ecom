import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * @param {{
 *   context?: 'user'|'admin',
 *   roles?: string[],
 *   requireVendorApproved?: boolean
 * }} props
 */
export default function ProtectedRoute({
    context = 'user',
    roles,
    requireVendorApproved = false,
}) {
    const location = useLocation();
    const auth = useSelector((s) => s.auth);

    // Wait for bootstrap to finish — otherwise we redirect before /auth/refresh resolves.
    if (!auth.bootstrapped) {
        return (
            <div className="min-h-screen flex items-center justify-center text-on-surface-variant">
                Loading…
            </div>
        );
    }

    // ── Admin context ─────────────────────────────────────
    if (context === 'admin') {
        if (!auth.isAdminAuthenticated) {
            return <Navigate to="/admin/login" state={{ from: location }} replace />;
        }
        if (roles && !roles.includes(auth.admin?.role)) {
            return <Navigate to="/403" replace />;
        }
        return <Outlet />;
    }

    // ── User context ──────────────────────────────────────
    if (!auth.isAuthenticated) {
        const loginPath = roles?.includes('vendor') ? '/vendor/login' : '/login';
        return <Navigate to={loginPath} state={{ from: location }} replace />;
    }
    if (roles && !roles.includes(auth.user?.role)) {
        return <Navigate to="/403" replace />;
    }

    // AFTER
    if (requireVendorApproved && auth.user?.vendor?.status !== 'approved') {
        const vendor = auth.user?.vendor;
        const dest =
            !vendor?.businessName
                ? '/vendor/setup'
                : vendor?.status === 'rejected'
                    ? '/vendor/rejected'
                    : '/vendor/pending';
        return <Navigate to={dest} replace />;
    }

    return <Outlet />;
}