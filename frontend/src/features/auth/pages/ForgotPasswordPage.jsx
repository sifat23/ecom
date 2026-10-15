import { Link } from 'react-router-dom';
import AuthFormShell from '../AuthFormShell';
import ForgotPasswordForm from '../ForgotPasswordForm';

export default function ForgotPasswordPage() {
    return (
        <AuthFormShell
            title="Reset your password"
            subtitle="We'll email you a link to choose a new customer password."
            footer={
                <Link to="/login" className="text-primary-container font-semibold hover:underline">
                    ← Back to customer sign in
                </Link>
            }
        >
            <ForgotPasswordForm />
        </AuthFormShell>
    );
}