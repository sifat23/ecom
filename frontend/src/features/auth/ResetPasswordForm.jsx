import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';

import { resetPasswordSchema } from './schemas';
import { useResetPasswordMutation } from '../../store/api/authApi';
import { FormInput } from './AuthFormShell';

export default function ResetPasswordForm({ redirectTo = '/login' }) {
    const { token } = useParams();
    const navigate = useNavigate();
    const [reset, { isLoading, error, isSuccess }] = useResetPasswordMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(resetPasswordSchema), mode: 'onBlur' });

    const onSubmit = async ({ newPassword }) => {
        try {
            await reset({ token, newPassword }).unwrap();
            setTimeout(() => navigate(redirectTo, { replace: true }), 1500);
        } catch { /* handled via `error` */ }
    };

    if (isSuccess) {
        return (
            <div className="rounded-lg bg-primary-fixed/40 px-4 py-3 text-body-md text-on-primary-fixed">
                Password updated. Redirecting you to sign in…
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormInput
                label="New password"
                type="password"
                autoComplete="new-password"
                error={errors.newPassword?.message}
                {...register('newPassword')}
            />
            <FormInput
                label="Confirm new password"
                type="password"
                autoComplete="new-password"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
            />

            {error && (
                <div className="rounded-lg bg-error-container/60 px-3 py-2.5 text-body-sm text-on-error-container">
                    {error.data?.error?.message || 'Reset failed'}
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-lg bg-primary-container text-on-primary font-semibold hover:bg-primary transition-colors disabled:opacity-60"
            >
                {isLoading ? 'Resetting…' : 'Reset password'}
            </button>
        </form>
    );
}