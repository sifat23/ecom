import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    useBootstrapSessionMutation,
    useAdminBootstrapMutation,
} from '../../store/api/authApi';
import { bootstrapComplete } from '../../store/slices/authSlice';

/**
 * Runs once on app mount. Silently tries /auth/refresh and /admin/auth/refresh
 * using the httpOnly cookies. Always marks `bootstrapped` when done.
 */
export function useBootstrapAuth() {
    const dispatch = useDispatch();
    const bootstrapped = useSelector((s) => s.auth.bootstrapped);
    const [bootstrap] = useBootstrapSessionMutation();
    const [adminBootstrap] = useAdminBootstrapMutation();

    useEffect(() => {
        if (bootstrapped) return;
        Promise.allSettled([
            bootstrap().unwrap().catch(() => {}),
            adminBootstrap().unwrap().catch(() => {}),
        ]).finally(() => {
            dispatch(bootstrapComplete());
        });
    }, [bootstrapped, bootstrap, adminBootstrap, dispatch]);
}