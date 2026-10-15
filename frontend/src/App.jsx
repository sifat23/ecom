import { RouterProvider } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { router } from './routes';
import { toastDismissed } from './store/slices/uiSlice';
import { useBootstrapAuth } from './features/auth/useBootstrapAuth';

function ToastViewport() {
    const toasts = useSelector((s) => s.ui.toasts);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!toasts.length) return;
        const timers = toasts.map((t) =>
            setTimeout(() => dispatch(toastDismissed(t.id)), t.timeout)
        );
        return () => timers.forEach(clearTimeout);
    }, [toasts, dispatch]);

    if (!toasts.length) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((t) => (
                <div
                    key={t.id}
                    className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white shadow-lg"
                >
                    {t.message}
                </div>
            ))}
        </div>
    );
}

export default function App() {
    useBootstrapAuth();

    return (
        <>
            <RouterProvider router={router} />
            <ToastViewport />
        </>
    );
}