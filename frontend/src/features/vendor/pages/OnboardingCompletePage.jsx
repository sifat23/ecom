import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetMyVendorQuery } from '../vendorApi';

export default function OnboardingCompletePage() {
    const navigate = useNavigate();
    const { data, isLoading, refetch } = useGetMyVendorQuery();

    useEffect(() => {
        refetch();
        if (isLoading) return;

        if (data?.status === 'approved') return navigate('/vendor/dashboard', { replace: true });
        if (data?.status === 'rejected') return navigate('/vendor/rejected', { replace: true });
        return navigate('/vendor/pending', { replace: true });
    }, [isLoading, data, navigate, refetch]);

    return (
        <div className="mx-auto max-w-[480px] px-margin-mobile py-space-xl text-center">
            <h1 className="text-headline-lg text-on-surface">Thanks — checking your status…</h1>
        </div>
    );
}