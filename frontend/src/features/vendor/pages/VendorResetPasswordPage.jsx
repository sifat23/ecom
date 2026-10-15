import { Link } from 'react-router-dom';
import AuthFormShell from '../../auth/AuthFormShell';
import ResetPasswordForm from '../../auth/ResetPasswordForm';

export default function VendorResetPasswordPage() {
    return (
        <AuthFormShell
            title="Choose a new vendor password"
            subtitle="Pick something strong and unique for your seller account."
            footer={
                <Link to="/vendor/login" className="text-primary-container font-semibold hover:underline">
                    ← Back to vendor portal sign in
                </Link>
            }
        >
            <ResetPasswordForm redirectTo="/vendor/login" />
        </AuthFormShell>
    );
}

