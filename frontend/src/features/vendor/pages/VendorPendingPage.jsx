import { Link } from 'react-router-dom';
import { useGetMyVendorQuery } from '../vendorApi';
import Button from '../../../components/ui/Button';

export default function VendorPendingPage() {
    const { data } = useGetMyVendorQuery();
    return (
        <div className="mx-auto max-w-[560px] px-margin-mobile py-space-xl text-center">
            <h1 className="text-headline-lg text-on-surface">Your application is under review</h1>
            <p className="mt-space-sm text-body-md text-on-surface-variant">
                We'll email you the moment a decision is made. You can still finish your Stripe setup if you
                haven't already.
            </p>
            {data?.stripeOnboardingComplete === false && (
                <Link to="/sell/onboarding" className="mt-space-lg inline-block">
                    <Button variant="primary">Finish Stripe setup</Button>
                </Link>
            )}
        </div>
    );
}