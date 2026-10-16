import { RouterProvider } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useRef } from 'react';
import { router } from './routes';
import { toastDismissed } from './store/slices/uiSlice';
import { useBootstrapAuth } from './features/auth/useBootstrapAuth';


const TOAST_STYLES = {
    info:    'bg-surface-container-lowest text-on-surface border-outline-variant',
    loading: 'bg-primary-container text-on-primary border-primary',
    success: 'bg-primary-fixed text-on-primary-fixed border-primary-fixed-dim',
    error:   'bg-error-container text-on-error-container border-error/40',
};

const TOAST_ICONS = {
    info:    'info',
    loading: 'progress_activity',
    success: 'check_circle',
    error:   'error',
};


function ToastCard({ toast }) {
    const { type = 'info', message } = toast;
    const styleCls = TOAST_STYLES[type] ?? TOAST_STYLES.info;
    const iconName = TOAST_ICONS[type] ?? TOAST_ICONS.info;

    return (
        <div
            role="status"
            aria-live="polite"
            className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border max-w-sm ${styleCls}`}
        >
            <span
                className={`material-symbols-outlined text-[18px] shrink-0 ${
                    type === 'loading' ? 'animate-spin' : ''
                }`}
            >
                {iconName}
            </span>
            <span className="text-body-md font-medium">{message}</span>
        </div>
    );
}


function ToastViewport() {
    const toasts = useSelector((s) => s.ui.toasts);
    const dispatch = useDispatch();
    const timersRef = useRef(new Map());

    useEffect(() => {
        const timers = timersRef.current;
        const liveIds = new Set(toasts.map((t) => t.id));

        // Schedule auto-dismiss for new non-sticky toasts
        toasts.forEach((t) => {
            if (t.timeout > 0 && !timers.has(t.id)) {
                const handle = setTimeout(() => {
                    dispatch(toastDismissed(t.id));
                    timers.delete(t.id);
                }, t.timeout);
                timers.set(t.id, handle);
            }
        });

        // Cancel timers for toasts that are already gone
        timers.forEach((handle, id) => {
            if (!liveIds.has(id)) {
                clearTimeout(handle);
                timers.delete(id);
            }
        });
    }, [toasts, dispatch]);

    // Clear all timers on unmount
    useEffect(() => () => {
        timersRef.current.forEach(clearTimeout);
        timersRef.current.clear();
    }, []);

    const bottomLeft  = toasts.filter((t) => t.position === 'bottom-left');
    const bottomRight = toasts.filter((t) => t.position !== 'bottom-left');

    return (
        <>
            <div className="fixed bottom-4 left-4 z-50 flex flex-col items-start gap-2 pointer-events-none">
                {bottomLeft.map((t) => <ToastCard key={t.id} toast={t} />)}
            </div>
            <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 pointer-events-none">
                {bottomRight.map((t) => <ToastCard key={t.id} toast={t} />)}
            </div>
        </>
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