import { Link } from 'react-router-dom';
import AuthFormShell from '../AuthFormShell';
import LoginForm from '../LoginForm';
import GoogleAuthButton from '../../../components/auth/GoogleAuthButton';

export default function LoginPage() {
    return (
        <AuthFormShell
            title="Customer Sign In"
            subtitle="Sign in to your customer account to view your orders and dashboard."
            footer={
                <div className="space-y-3">
                    <p>
                        New here?{' '}
                        <Link to="/register" className="text-primary-container font-semibold hover:underline">
                            Create a customer account
                        </Link>
                    </p>
                    <div className="pt-2 border-t border-outline-variant/50 text-[13px]">
                        Are you a seller?{' '}
                        <Link to="/vendor/login" className="text-primary font-semibold hover:underline">
                            Sign in to Vendor Portal →
                        </Link>
                    </div>
                </div>
            }
        >
            <div className="flex flex-col gap-5">
                <GoogleAuthButton role="customer" />

                <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-outline-variant/60" />
                    <span className="text-label-sm text-on-surface-variant font-medium">Or continue with email</span>
                    <div className="h-px flex-1 bg-outline-variant/60" />
                </div>

                <LoginForm expectedRole="customer" />
            </div>
        </AuthFormShell>
    );
}