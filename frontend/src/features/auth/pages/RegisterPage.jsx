import { Link } from 'react-router-dom';
import AuthFormShell from '../AuthFormShell';
import RegisterForm from '../RegisterForm';
import GoogleAuthButton from '../../../components/auth/GoogleAuthButton';

export default function RegisterPage() {
    return (
        <AuthFormShell
            title="Create Customer Account"
            subtitle="Sign up to start shopping, tracking orders, and managing your account."
            maxWidth="max-w-lg"
            footer={
                <div className="space-y-3">
                    <p>
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-container font-semibold hover:underline">
                            Sign in
                        </Link>
                    </p>
                    <div className="pt-2 border-t border-outline-variant/50 text-[13px]">
                        Looking to sell your products?{' '}
                        <Link to="/vendor/register" className="text-primary font-semibold hover:underline">
                            Register as a Vendor →
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

                <RegisterForm role="customer" />
            </div>
        </AuthFormShell>
    );
}