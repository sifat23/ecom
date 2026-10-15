import { Link } from 'react-router-dom';
import AuthFormShell from '../AuthFormShell';
import RegisterForm from '../RegisterForm';

export default function RegisterPage() {
    return (
        <AuthFormShell
            title="Become a seller"
            subtitle="Register your business on Marketplace and start listing products. Approval is required before your listings go live."
            maxWidth="max-w-lg"
            footer={
                <>
                    Already have a seller account?{' '}
                    <Link to="/login" className="text-primary-container font-semibold hover:underline">
                        Sign in
                    </Link>
                </>
            }
        >
            <RegisterForm />
        </AuthFormShell>
    );
}