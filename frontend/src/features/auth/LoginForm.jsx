import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { loginSchema } from './schemas';
import { useLoginMutation } from '../../store/api/authApi';
import { FormInput } from './AuthFormShell';

export default function LoginForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const [login, { isLoading, error }] = useLoginMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(loginSchema),
        mode: 'onBlur',
    });

    const onSubmit = async (values) => {
        try {
            const result = await login(values).unwrap();
            const user = result.data.user;
            const from = location.state?.from?.pathname;

            // Vendors: check approval status before honoring `from`
            if (user.role === 'vendor') {
                const status = user.vendor?.status;

                if (status === 'approved') {
                    return navigate(from || '/vendor/dashboard', { replace: true });
                }
                if (status === 'rejected') {
                    return navigate('/vendor/rejected', { replace: true });
                }
                // pending / suspended / no vendor profile yet
                return navigate('/vendor/pending', { replace: true });
            }

            // Customers
            navigate(from || '/account', { replace: true });
        } catch {
            /* handled via `error` */
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormInput
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email')}
            />

            <FormInput
                label="Password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
            />

            <div className="flex items-center justify-between text-body-sm">
                <Link
                    to="/forgot-password"
                    className="text-primary-container font-semibold hover:underline"
                >
                    Forgot password?
                </Link>
            </div>

            {error && (
                <div className="rounded-lg bg-error-container/60 px-3 py-2.5 text-body-sm text-on-error-container">
                    {error.data?.error?.message || 'Login failed'}
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full py-3 rounded-lg bg-primary-container text-on-primary font-semibold hover:bg-primary transition-colors disabled:opacity-60"
            >
                {isLoading ? 'Signing in…' : 'Sign in'}
            </button>
        </form>
    );
}