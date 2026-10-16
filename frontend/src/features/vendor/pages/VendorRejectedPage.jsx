import { Link } from 'react-router-dom';
import { useGetMyVendorQuery } from '../vendorApi';

export default function VendorRejectedPage() {
    const { data } = useGetMyVendorQuery();
    // const [resubmit, { isLoading }] = useResubmitVendorMutation();

    const onResubmit = async () => {
        try {
            await resubmit({}).unwrap();
            window.location.reload();
        } catch (_) { /* noop */ }
    };

    return (
        <div className="mx-auto max-w-[560px] px-margin-mobile py-space-xl">
            <h1 className="text-headline-lg text-on-surface">Application not approved</h1>
            {data?.rejectionReason && (
                <p className="mt-space-sm rounded-lg bg-error-container p-space-md text-body-md text-on-error-container">
                    {data.rejectionReason}
                </p>
            )}
            <div className="mt-space-lg flex gap-space-sm">
                <button
                    onClick={onResubmit}
                    disabled={isLoading}
                    className="rounded-lg bg-primary px-space-lg py-space-sm text-label-lg text-on-primary hover:bg-primary-container disabled:opacity-60"
                >
                    Resubmit application
                </button>
                <Link
                    to="/sell/register"
                    className="rounded-lg border border-outline px-space-lg py-space-sm text-label-lg text-on-surface hover:bg-surface-container-low"
                >
                    Update details
                </Link>
            </div>
        </div>
    );
}