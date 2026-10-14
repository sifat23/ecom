import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ allowedRole, requiredActor = 'user' }) {
    const { isAuthenticated, user, actorType } = useSelector((state) => state.auth);

    if (!isAuthenticated || actorType !== requiredActor) {
        return <Navigate to={requiredActor === 'admin' ? '/admin/login' : '/login'} replace />;
    }

    if (allowedRole && user?.role !== allowedRole) {
        return <Navigate to="/403" replace />;
    }

    return <Outlet />;
}