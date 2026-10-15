import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useBootstrapSessionMutation } from '../../store/api/authApi';

/**
 * Runs once on app mount. Silently tries /auth/refresh using the
 * httpOnly cookie. Always marks `bootstrapped` when done.
 */
export function useBootstrapAuth() {
    const dispatch = useDispatch();
    const bootstrapped = useSelector((s) => s.auth.bootstrapped);
    const [bootstrap] = useBootstrapSessionMutation();

    useEffect(() => {
        if (bootstrapped) return;
        bootstrap().catch(() => {});
    }, [bootstrapped, bootstrap]);
}