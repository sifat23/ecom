import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';

import { forgotPasswordSchema } from './schemas';
import { useForgotPasswordMutation } from '../../store/api/authApi';
import { FormInput } from './AuthFormShell';

export default function ForgotPasswordForm() {
    const [sent, setSent] = useState(false);
    const [forgot, { isLoading }] = useForgotPasswordMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(forgotPasswordSchema), mode: 'onBlur' });

    const onSubmit = async (values) => {
        try {
            await forgot(values).unwrap();
            setSent(true);
        } catch { /* always returns success anyway */ }
    };

    if (sent) {
        return (
            <div className="rounded-lg bg-primary-fixed/40 px-4 py-3 text-body-md text-on-primary-fixed">
                If that email is registered, a reset link is on its way. Check your inbox
                (and spam folder).
            </div>
        );
    }

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
            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-lg bg-primary-container text-on-primary font-semibold hover:bg-primary transition-colors disabled:opacity-60"
            >
                {isLoading ? 'Sending…' : 'Send reset link'}
            </button>
        </form>
    );
}