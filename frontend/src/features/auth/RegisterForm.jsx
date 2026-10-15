import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';

import { registerSchema } from './schemas';
import { useRegisterMutation } from '../../store/api/authApi';
import { FormInput } from './AuthFormShell';

export default function RegisterForm() {
    const navigate = useNavigate();
    const [registerUser, { isLoading, error }] = useRegisterMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(registerSchema),
        mode: 'onBlur',
        // This page is vendor-only — role is pinned and no input renders for it.
        defaultValues: { role: 'vendor' },
    });

    const onSubmit = async (values) => {
        const { confirmPassword, ...payload } = values;
        try {
            await registerUser(payload).unwrap();
            navigate('/verify-email/sent', {
                replace: true,
                state: { email: payload.email },
            });


            // const result = await registerUser(payload).unwrap();
            // navigate('/sell/onboarding', { replace: true });
        } catch {
            /* error already surfaced via `error` from the mutation */
        }
    };

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
                label="Business email"
                type="email"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email')}
            />

            <FormInput
                label="Phone (optional)"
                type="tel"
                autoComplete="tel"
                error={errors.phone?.message}
                {...register('phone')}
            />

            <FormInput
                label="Password"
                type="password"
                autoComplete="new-password"
                error={errors.password?.message}
                {...register('password')}
            />

            <FormInput
                label="Confirm password"
                type="password"
                autoComplete="new-password"
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
                className="mt-2 w-full py-3 rounded-lg bg-primary-container text-on-primary font-semibold hover:bg-primary transition-colors disabled:opacity-60"
            >
                {isLoading ? 'Creating account…' : 'Create seller account'}
            </button>
        </form>
    );
}