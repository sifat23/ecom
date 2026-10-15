import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateOnboardingLinkMutation } from '../vendorApi';

export default function StripeOnboardingPage() {
    const navigate = useNavigate();
    const [createLink, { isLoading, error }] = useCreateOnboardingLinkMutation();

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const { url } = await createLink().unwrap();
                if (!cancelled && url) window.location.href = url; // full-page redirect to Stripe
            } catch (_) {
                if (!cancelled) navigate('/vendor/pending');
            }
        })();
        return () => { cancelled = true; };
    }, [createLink, navigate]);

    return (
        <div className="mx-auto max-w-[480px] px-margin-mobile py-space-xl text-center">
            <h1 className="text-headline-lg text-on-surface">
                {isLoading ? 'Redirecting to Stripe…' : 'Preparing your onboarding…'}
            </h1>
            <p className="mt-space-sm text-body-md text-on-surface-variant">
                Stripe verifies your identity so we can pay you. This usually takes a few minutes.
            </p>
            {error && (
                <p className="mt-space-md text-body-md text-error">
                    We couldn't create the Stripe link. You can retry from your dashboard.
                </p>
            )}
        </div>
    );
}