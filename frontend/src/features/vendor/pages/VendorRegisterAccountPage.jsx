import { Link } from 'react-router-dom';
import AuthFormShell from '../../auth/AuthFormShell';
import RegisterForm from '../../auth/RegisterForm';
import GoogleAuthButton from '../../../components/auth/GoogleAuthButton';

export default function VendorRegisterAccountPage() {
    return (
        <AuthFormShell
            title="Become a Seller"
            subtitle="Register your business on Marketplace and start listing products."
            maxWidth="max-w-lg"
            footer={
                <div className="space-y-3">
                    <p>
                        Already have a seller account?{' '}
                        <Link to="/vendor/login" className="text-primary-container font-semibold hover:underline">
                            Sign in to Vendor Portal
                        </Link>
                    </p>
                    <div className="pt-2 border-t border-outline-variant/50 text-[13px]">
                        Looking for a customer account?{' '}
                        <Link to="/register" className="text-primary font-semibold hover:underline">
                            Create customer account →
                        </Link>
                    </div>
                </div>
            }
        >
            <div className="flex flex-col gap-5">
                <GoogleAuthButton role="vendor" />

                <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-outline-variant/60" />
                    <span className="text-label-sm text-on-surface-variant font-medium">Or register with email</span>
                    <div className="h-px flex-1 bg-outline-variant/60" />
                </div>

                <RegisterForm role="vendor" />
            </div>
        </AuthFormShell>
    );
}

