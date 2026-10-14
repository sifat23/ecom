import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * @param {{ context?: 'user'|'admin', roles?: string[], requireVendorApproved?: boolean }} props
 */
export default function ProtectedRoute({
                                           context = 'user',
                                           roles,
                                           requireVendorApproved = false,
                                       }) {
    const location = useLocation();
    const auth = useSelector((s) => s.auth);

    // ── Admin context (completely separate token) ──────────
    if (context === 'admin') {
        if (!auth.adminToken) {
            return <Navigate to="/admin/login" state={{ from: location }} replace />;
        }
        if (roles && !roles.includes(auth.admin?.role)) {
            return <Navigate to="/403" replace />;
        }
        return <Outlet />;
    }

    // ── User context (customer / vendor) ───────────────────
    if (!auth.isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    if (roles && !roles.includes(auth.user?.role)) {
        return <Navigate to="/403" replace />;
    }
    // Phase 2: check vendor.status === 'approved'
    if (requireVendorApproved && auth.user?.vendorStatus && auth.user.vendorStatus !== 'approved') {
        return <Navigate to="/sell/pending" replace />;
    }

    return <Outlet />;
}