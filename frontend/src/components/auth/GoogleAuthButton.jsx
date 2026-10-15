import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGoogleAuthMutation } from '../../store/api/authApi';

export default function GoogleAuthButton({ role = 'customer' }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [googleAuth, { isLoading, error }] = useGoogleAuthMutation();
    const [devPromptOpen, setDevPromptOpen] = useState(false);
    const [devEmail, setDevEmail] = useState('');

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    // Load Google Identity Services script if Client ID is configured
    useEffect(() => {
        if (!clientId) return;

        const scriptId = 'google-gsi-client';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);
        }
    }, [clientId]);

    const handleSuccess = (user) => {
        const from = location.state?.from?.pathname;

        if (user.role === 'vendor') {
            const status = user.vendor?.status;
            if (status === 'approved') return navigate(from || '/vendor/dashboard', { replace: true });
            if (status === 'rejected') return navigate('/vendor/rejected', { replace: true });
            return navigate('/vendor/pending', { replace: true });
        }

        // Customer
        navigate(from || '/account', { replace: true });
    };

    const handleGoogleClick = () => {
        if (clientId && window.google?.accounts?.id) {
            window.google.accounts.id.initialize({
                client_id: clientId,
                callback: async (response) => {
                    try {
                        const result = await googleAuth({
                            credential: response.credential,
                            role,
                        }).unwrap();
                        handleSuccess(result.data.user);
                    } catch (_) {}
                },
            });
            window.google.accounts.id.prompt();
            return;
        }

        // Fallback: development mode / mock prompt if Google Client ID not yet set
        setDevEmail(role === 'vendor' ? 'seller@gmail.com' : 'buyer@gmail.com');
        setDevPromptOpen(true);
    };

    const handleDevSubmit = async (e) => {
        e.preventDefault();
        if (!devEmail) return;
        try {
            const result = await googleAuth({
                credential: `dev_mock_${devEmail.trim().toLowerCase()}`,
                role,
            }).unwrap();
            setDevPromptOpen(false);
            handleSuccess(result.data.user);
        } catch (_) {}
    };

    return (
        <div className="w-full">
            <button
                type="button"
                onClick={handleGoogleClick}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low text-on-surface font-semibold text-body-md transition-all shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            >
                {/* Official Google 'G' icon */}
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                    />
                    <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                </svg>
                <span>{isLoading ? 'Connecting with Google…' : 'Continue with Google'}</span>
            </button>

            {error && (
                <div className="mt-3 rounded-lg bg-error-container/60 px-3 py-2.5 text-body-sm text-on-error-container">
                    {error.data?.error?.message || 'Google sign-in failed'}
                </div>
            )}

            {/* Dev helper modal for testing when Google OAuth Client ID is not configured */}
            {devPromptOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-sm rounded-2xl bg-surface-container-lowest p-6 shadow-xl border border-outline-variant animate-in">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-primary-container" />
                            <h3 className="text-title-md font-bold text-on-surface">Google Sign-In (Dev Simulation)</h3>
                        </div>
                        <p className="text-body-sm text-on-surface-variant mb-4">
                            Simulate signing in with a Google account as <strong>{role}</strong>. In production, this uses official Google Identity Services.
                        </p>
                        <form onSubmit={handleDevSubmit} className="flex flex-col gap-3">
                            <input
                                type="email"
                                value={devEmail}
                                onChange={(e) => setDevEmail(e.target.value)}
                                placeholder="name@gmail.com"
                                required
                                className="w-full px-3.5 py-2 rounded-lg bg-surface-container-low text-on-surface border border-transparent focus:ring-2 focus:ring-primary-container outline-none text-body-md"
                            />
                            <div className="flex items-center justify-end gap-2 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setDevPromptOpen(false)}
                                    className="px-3 py-1.5 rounded-lg text-body-sm font-medium text-on-surface-variant hover:bg-surface-container"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-4 py-1.5 rounded-lg text-body-sm font-semibold bg-primary-container text-on-primary hover:bg-primary"
                                >
                                    {isLoading ? 'Signing in…' : `Continue as ${role}`}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

