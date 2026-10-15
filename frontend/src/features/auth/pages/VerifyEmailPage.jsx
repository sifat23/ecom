import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import AuthFormShell, { FormInput } from '../AuthFormShell';
import {
    useVerifyEmailMutation,
    useResendVerificationMutation,
} from '../../../store/api/authApi';

const emailSchema = yup.object({
    email: yup.string().trim().email('Enter a valid email').required('Email is required'),
});

const BTN = 'w-full py-3 rounded-lg bg-primary-container text-on-primary font-semibold hover:bg-primary transition-colors disabled:opacity-60';

export default function VerifyEmailPage() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [verify] = useVerifyEmailMutation();
    const [resend, { isLoading: isResending, isSuccess: resentOk, error: resendError }] =
        useResendVerificationMutation();

    // idle → verifying → success | expired | invalid | missing
    const [state, setState] = useState({ kind: 'idle' });

    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(emailSchema),
        mode: 'onBlur',
    });

    // On mount, verify the token (if we have one).
    useEffect(() => {
        if (!token) {
            setState({ kind: 'missing' });
            return;
        }
        let cancelled = false;

        (async () => {
            setState({ kind: 'verifying' });
            try {
                const res = await verify({ token }).unwrap();
                if (cancelled) return;
                setState({ kind: 'success', email: res.data.email });
            } catch (err) {
                if (cancelled) return;
                const code  = err?.data?.error?.code;
                const email = err?.data?.error?.details?.email;
                if (code === 'EMAIL_VERIFY_EXPIRED') {
                    setState({ kind: 'expired', email });
                    if (email) setValue('email', email);
                } else {
                    setState({ kind: 'invalid' });
                }
            }
        })();

        return () => { cancelled = true; };
    }, [token, verify, setValue]);

    // Auto-redirect after success.
    useEffect(() => {
        if (state.kind !== 'success') return;
        const id = setTimeout(() => navigate('/login', { replace: true }), 2500);
        return () => clearTimeout(id);
    }, [state, navigate]);

    const onResendWithEmail = async ({ email }) => {
        try { await resend({ email }).unwrap(); } catch { /* rendered below */ }
    };

    const onResendKnownEmail = async () => {
        if (!state.email) return;
        try { await resend({ email: state.email }).unwrap(); } catch { /* rendered below */ }
    };

    // ── Render branches ───────────────────────────────────

    if (state.kind === 'idle' || state.kind === 'verifying') {
        return (
            <AuthFormShell title="Verifying your email…" subtitle="One moment.">
                <div className="h-1 rounded-full bg-surface-container-low overflow-hidden">
                    <div className="h-full w-1/2 bg-primary-container animate-pulse" />
                </div>
            </AuthFormShell>
        );
    }

    if (resentOk) {
        return (
            <AuthFormShell
                title="Check your inbox"
                subtitle={`A fresh verification link is on its way. It expires in 15 minutes.`}
                footer={<Link to="/login" className="text-primary-container font-semibold hover:underline">Back to sign in</Link>}
            >
                <p className="text-body-md text-on-surface-variant">
                    Didn't get it? Check spam, or wait a minute and try again.
                </p>
            </AuthFormShell>
        );
    }

    if (state.kind === 'success') {
        return (
            <AuthFormShell
                title="Email verified 🎉"
                subtitle={`${state.email} is confirmed. Redirecting you to sign in…`}
                footer={<Link to="/login" className="text-primary-container font-semibold hover:underline">Sign in now</Link>}
            >
                <p className="text-body-md text-on-surface-variant">
                    You can close this tab if you'd like.
                </p>
            </AuthFormShell>
        );
    }

    if (state.kind === 'expired') {
        return (
            <AuthFormShell
                title="This link has expired"
                subtitle={
                    state.email
                        ? `For security, verification links are only valid for 15 minutes. We can send a new one to ${state.email}.`
                        : `For security, verification links are only valid for 15 minutes.`
                }
            >
                <button onClick={onResendKnownEmail} disabled={isResending} className={BTN}>
                    {isResending ? 'Sending…' : 'Send a new link'}
                </button>

                {resendError && (
                    <div className="mt-3 rounded-lg bg-error-container/60 px-3 py-2.5 text-body-sm text-on-error-container">
                        {resendError.data?.error?.message || 'Could not send the email. Try again in a minute.'}
                    </div>
                )}
            </AuthFormShell>
        );
    }

    // 'invalid' or 'missing'
    return (
        <AuthFormShell
            title="Link not valid"
            subtitle="This verification link is invalid or has already been used. Enter your email and we'll send a fresh one."
        >
            <form onSubmit={handleSubmit(onResendWithEmail)} className="flex flex-col gap-4">
                <FormInput
                    label="Email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    error={errors.email?.message}
                    {...register('email')}
                />

                {resendError && (
                    <div className="rounded-lg bg-error-container/60 px-3 py-2.5 text-body-sm text-on-error-container">
                        {resendError.data?.error?.message || 'Could not send the email. Try again in a minute.'}
                    </div>
                )}

                <button type="submit" disabled={isResending} className={BTN}>
                    {isResending ? 'Sending…' : 'Send a new link'}
                </button>
            </form>
        </AuthFormShell>
    );
}