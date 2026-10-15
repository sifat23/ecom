import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthFormShell from '../AuthFormShell';
import { useResendVerificationMutation } from '../../../store/api/authApi';

const BTN =
    'w-full py-3 rounded-lg bg-primary-container text-on-primary font-semibold ' +
    'hover:bg-primary transition-colors disabled:opacity-60';

export default function CheckYourEmailPage() {
    const location = useLocation();
    const email = location.state?.email ?? '';

    const [resend, { isLoading, isSuccess, error }] = useResendVerificationMutation();
    const [cooldown, setCooldown] = useState(false);

    const onResend = async () => {
        if (!email) return;
        try {
            await resend({ email }).unwrap();
            setCooldown(true);
            setTimeout(() => setCooldown(false), 60_000);
        } catch { /* rendered below */ }
    };

    return (
        <AuthFormShell
            title="Check your inbox"
            subtitle={
                email
                    ? `We sent a verification link to ${email}. Click it within 15 minutes to activate your account.`
                    : 'We sent a verification link to your email. Click it within 15 minutes to activate your account.'
            }
            footer={
                <>
                    Wrong email?{' '}
                    <Link
                        to="/register"
                        className="text-primary-container font-semibold hover:underline"
                    >
                        Start over
                    </Link>
                </>
            }
        >
            <div className="flex flex-col gap-4">
                <div className="rounded-lg bg-primary-fixed/40 px-4 py-3 text-body-md text-on-primary-fixed">
                    <p className="font-semibold">The link expires in 15 minutes.</p>
                    <p className="mt-1">
                        Can't find it? Check your <strong>spam</strong> /{' '}
                        <strong>promotions</strong> folder.
                    </p>
                </div>

                {email && (
                    <button
                        onClick={onResend}
                        disabled={isLoading || cooldown}
                        className={BTN}
                    >
                        {isLoading
                            ? 'Sending…'
                            : cooldown
                                ? 'Sent — wait a minute to resend'
                                : 'Resend verification email'}
                    </button>
                )}

                {isSuccess && (
                    <p className="text-body-sm text-on-surface-variant">
                        A fresh link is on its way. It also expires in 15 minutes.
                    </p>
                )}

                {error && (
                    <div className="rounded-lg bg-error-container/60 px-3 py-2.5 text-body-sm text-on-error-container">
                        {error.data?.error?.message ||
                            'Could not resend. Try again shortly.'}
                    </div>
                )}
            </div>
        </AuthFormShell>
    );
}