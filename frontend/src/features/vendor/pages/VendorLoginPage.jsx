import { Link } from 'react-router-dom';
import AuthFormShell from '../../auth/AuthFormShell';
import LoginForm from '../../auth/LoginForm';
import GoogleAuthButton from '../../../components/auth/GoogleAuthButton';

export default function VendorLoginPage() {
    return (
        <AuthFormShell
            title="Vendor Portal"
            subtitle="Sign in to your seller account to manage your store, inventory, and orders."
            footer={
                <div className="space-y-3">
                    <p>
                        Don't have a seller account?{' '}
                        <Link to="/vendor/register" className="text-primary-container font-semibold hover:underline">
                            Register as a vendor
                        </Link>
                    </p>
                    <div className="pt-2 border-t border-outline-variant/50 text-[13px]">
                        Looking for customer login?{' '}
                        <Link to="/login" className="text-primary font-semibold hover:underline">
                            Go to Customer Sign In →
                        </Link>
                    </div>
                </div>
            }
        >
            <div className="flex flex-col gap-5">
                <GoogleAuthButton role="vendor" />

                <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-outline-variant/60" />
                    <span className="text-label-sm text-on-surface-variant font-medium">Or sign in with email</span>
                    <div className="h-px flex-1 bg-outline-variant/60" />
                </div>

                <LoginForm expectedRole="vendor" />
            </div>
        </AuthFormShell>
    );
}

