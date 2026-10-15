import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, Link } from 'react-router-dom';

import { loginSchema } from './schemas';
import { useAdminLoginMutation } from '../../store/api/authApi';

export default function AdminLoginForm() {
    const navigate = useNavigate();
    const [adminLogin, { isLoading, error }] = useAdminLoginMutation();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(loginSchema),
        mode: 'onBlur',
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (values) => {
        try {
            await adminLogin(values).unwrap();
            navigate('/admin/dashboard', { replace: true });
        } catch {
            /* error is handled via `error` state from RTK Query */
        }
    };

    const handleQuickFill = () => {
        setValue('email', 'admin@marketplace.local', { shouldValidate: true });
        setValue('password', 'Password123!', { shouldValidate: true });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {/* Quick Demo Credentials Pill */}
            <div className="p-3.5 rounded-xl bg-[#091510] border border-[#1e3b2f] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-primary-fixed-dim uppercase tracking-wider">
                        <span className="material-symbols-outlined text-[14px]">key</span>
                        <span>Seeded Super Admin Credentials</span>
                    </div>
                    <span className="text-xs text-white/80 mt-0.5">
                        admin@marketplace.local &middot; Password123!
                    </span>
                </div>
                <button
                    type="button"
                    onClick={handleQuickFill}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-primary-container text-primary-fixed hover:bg-primary-container/80 transition-colors shrink-0"
                >
                    Auto Fill
                </button>
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center justify-between">
                    <span>Admin Email</span>
                    <span className="text-[11px] text-slate-400 font-normal">Super Admin / Staff</span>
                </label>
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                        mail
                    </span>
                    <input
                        type="email"
                        autoComplete="email"
                        placeholder="admin@marketplace.local"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#0b1612] border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-fixed-dim transition-all ${
                            errors.email ? 'border-error ring-1 ring-error' : 'border-[#234235] hover:border-[#35614e]'
                        }`}
                        {...register('email')}
                    />
                </div>
                {errors.email && (
                    <span className="text-xs text-secondary-fixed-dim font-medium">{errors.email.message}</span>
                )}
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                        Passphrase / Key
                    </label>
                    <Link
                        to="/admin/forgot-password"
                        className="text-xs text-primary-fixed-dim hover:text-white transition-colors"
                    >
                        Forgot password?
                    </Link>
                </div>
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                        lock
                    </span>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        placeholder="••••••••••••"
                        className={`w-full pl-10 pr-11 py-2.5 rounded-lg bg-[#0b1612] border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-fixed-dim transition-all ${
                            errors.password ? 'border-error ring-1 ring-error' : 'border-[#234235] hover:border-[#35614e]'
                        }`}
                        {...register('password')}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        <span className="material-symbols-outlined text-[18px]">
                            {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                    </button>
                </div>
                {errors.password && (
                    <span className="text-xs text-secondary-fixed-dim font-medium">{errors.password.message}</span>
                )}
            </div>

            {/* Error Banner */}
            {error && (
                <div className="p-3 rounded-lg bg-error/20 border border-error/40 flex items-start gap-2.5 text-xs text-rose-200">
                    <span className="material-symbols-outlined text-[18px] text-secondary-fixed-dim shrink-0">
                        error
                    </span>
                    <span>{error.data?.error?.message || 'Access denied. Please check your credentials.'}</span>
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-primary-container hover:bg-[#236350] active:scale-[0.99] text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
                {isLoading ? (
                    <>
                        <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                        <span>Authenticating Console Session…</span>
                    </>
                ) : (
                    <>
                        <span className="material-symbols-outlined text-[18px]">shield_person</span>
                        <span>Authenticate to Atelier Console</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </>
                )}
            </button>
        </form>
    );
}