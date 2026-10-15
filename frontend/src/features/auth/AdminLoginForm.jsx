import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';

import { loginSchema } from './schemas';
import { useAdminLoginMutation } from '../../store/api/authApi';
import { FormInput } from './AuthFormShell';

export default function AdminLoginForm() {
    const navigate = useNavigate();
    const [adminLogin, { isLoading, error }] = useAdminLoginMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(loginSchema), mode: 'onBlur' });

    const onSubmit = async (values) => {
        try {
            await adminLogin(values).unwrap();
            navigate('/admin/dashboard', { replace: true });
        } catch { /* handled via `error` */ }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormInput
                label="Admin email"
                type="email"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email')}
            />
            <FormInput
                label="Password"
                type="password"
                autoComplete="current-password"
                error={errors.password?.message}
                {...register('password')}
            />

            {error && (
                <div className="rounded-lg bg-error-container/60 px-3 py-2.5 text-body-sm text-on-error-container">
                    {error.data?.error?.message || 'Login failed'}
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary-container transition-colors disabled:opacity-60"
            >
                {isLoading ? 'Signing in…' : 'Sign in to Admin'}
            </button>
        </form>
    );
}