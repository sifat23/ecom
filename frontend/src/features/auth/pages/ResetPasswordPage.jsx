import AuthFormShell from '../AuthFormShell';
import ResetPasswordForm from '../ResetPasswordForm';

export default function ResetPasswordPage() {
    return (
        <AuthFormShell
            title="Choose a new password"
            subtitle="Pick something strong and unique."
        >
            <ResetPasswordForm />
        </AuthFormShell>
    );
}