import AuthFormShell from '../AuthFormShell';
import ForgotPasswordForm from '../ForgotPasswordForm';

export default function ForgotPasswordPage() {
    return (
        <AuthFormShell
            title="Reset your password"
            subtitle="We'll email you a link to choose a new password."
        >
            <ForgotPasswordForm />
        </AuthFormShell>
    );
}