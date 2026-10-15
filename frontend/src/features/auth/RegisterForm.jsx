import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';

import { registerSchema } from './schemas';
import { useRegisterMutation } from '../../store/api/authApi';
import { FormInput } from './AuthFormShell';

export default function RegisterForm({ role = 'customer' }) {
    const navigate = useNavigate();
    const [registerUser, { isLoading, error }] = useRegisterMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(registerSchema),
        mode: 'onBlur',
        defaultValues: { role },
    });

    const onSubmit = async (values) => {
        const { confirmPassword, ...payload } = values;
        try {
            await registerUser({ ...payload, role }).unwrap();

            if (role === 'vendor') {
                // Vendors require verification
                navigate('/verify-email/sent', {
                    replace: true,
                    state: { email: payload.email },
                });
            } else {
                // Customers do not need verification — go straight to customer dashboard
                navigate('/account', { replace: true });
            }
        } catch {
            /* error already surfaced via `error` from the mutation */
        }
    };

    const isVendor = role === 'vendor';

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
                <FormInput
                    label="First name"
                    error={errors.firstName?.message}
                    {...register('firstName')}
                />
                <FormInput
                    label="Last name"
                    error={errors.lastName?.message}
                    {...register('lastName')}
                />
            </div>

            <FormInput
                label={isVendor ? 'Business email' : 'Email address'}
                type="email"
                autoComplete="email"
                placeholder={isVendor ? 'seller@example.com' : 'you@example.com'}
                error={errors.email?.message}
                {...register('email')}
            />

            <FormInput
                label="Phone (optional)"
                type="tel"
                autoComplete="tel"
                placeholder="+1 (555) 000-0000"
                error={errors.phone?.message}
                {...register('phone')}
            />

            <FormInput
                label="Password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
            />

            <FormInput
                label="Confirm password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
            />

            {error && (
                <div className="rounded-lg bg-error-container/60 px-3 py-2.5 text-body-sm text-on-error-container">
                    {error.data?.error?.message || 'Registration failed'}
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full py-3 rounded-lg bg-primary-container text-on-primary font-semibold hover:bg-primary transition-colors disabled:opacity-60 cursor-pointer"
            >
                {isLoading
                    ? 'Creating account…'
                    : isVendor
                    ? 'Create seller account'
                    : 'Create customer account'}
            </button>
        </form>
    );
}