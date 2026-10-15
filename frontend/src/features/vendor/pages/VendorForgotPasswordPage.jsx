import { Link } from 'react-router-dom';
import AuthFormShell from '../../auth/AuthFormShell';
import ForgotPasswordForm from '../../auth/ForgotPasswordForm';

export default function VendorForgotPasswordPage() {
    return (
        <AuthFormShell
            title="Reset Vendor Password"
            subtitle="Enter your vendor account email and we'll send you a password reset link."
            footer={
                <Link to="/vendor/login" className="text-primary-container font-semibold hover:underline">
                    ← Back to vendor portal sign in
                </Link>
            }
        >
            <ForgotPasswordForm />
        </AuthFormShell>
    );
}

