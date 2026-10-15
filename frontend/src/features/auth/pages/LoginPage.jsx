import { Link } from 'react-router-dom';
import AuthFormShell from '../AuthFormShell';
import LoginForm from '../LoginForm';

export default function LoginPage() {
    return (
        <AuthFormShell
            title="Welcome back"
            subtitle="Sign in to your Marketplace account."
            footer={
                <>
                    New here?{' '}
                    <Link to="/register" className="text-primary-container font-semibold hover:underline">
                        Create an account
                    </Link>
                </>
            }
        >
            <LoginForm />
        </AuthFormShell>
    );
}