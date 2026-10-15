import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams, Link, useNavigate } from 'react-router-dom';

import { resetPasswordSchema } from '../schemas';
import { useAdminResetPasswordMutation } from '../../../store/api/authApi';

export default function AdminResetPasswordPage() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [adminResetPassword, { isLoading, error }] = useAdminResetPasswordMutation();
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(resetPasswordSchema),
        mode: 'onBlur',
    });

    const onSubmit = async (values) => {
        try {
            await adminResetPassword({
                token,
                newPassword: values.newPassword,
            }).unwrap();
            setSuccess(true);
        } catch {
            /* error displayed via error banner */
        }
    };

    return (
        <div className="min-h-screen bg-[#070f0c] text-white flex flex-col justify-between relative overflow-hidden select-none">
            {/* Ambient Lighting */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary-container/25 blur-[120px] rounded-full pointer-events-none" />

            {/* Header */}
            <header className="relative z-10 w-full px-6 py-5 flex items-center justify-between max-w-7xl mx-auto">
                <Link to="/" className="flex items-center gap-2.5 text-white group">
                    <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-primary-fixed shadow-md group-hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-[18px]">spa</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-base tracking-tight leading-none text-white">Minimog</span>
                        <span className="text-[10px] text-primary-fixed-dim uppercase tracking-wider font-semibold">
                            Atelier Console
                        </span>
                    </div>
                </Link>

                <Link
                    to="/admin/login"
                    className="inline-flex items-center gap-1.5 text-xs text-primary-fixed-dim hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-[#11231c] border border-[#1e3c2f]"
                >
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    <span>Admin Sign In</span>
                </Link>
            </header>

            {/* Form Container */}
            <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-md">
                    <div className="rounded-2xl bg-[#0f1d17]/95 border border-[#203a2e] shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl p-7 sm:p-9 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-fixed-dim to-transparent opacity-60" />

                        {success ? (
                            <div className="flex flex-col items-center text-center gap-4 py-2">
                                <div className="w-14 h-14 rounded-2xl bg-primary-container border border-primary-fixed-dim/40 flex items-center justify-center text-primary-fixed">
                                    <span className="material-symbols-outlined text-[30px]">check_circle</span>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <h1 className="text-xl font-bold text-white">Password Updated Successfully</h1>
                                    <p className="text-xs text-slate-300 max-w-xs leading-relaxed">
                                        Your administrator security credentials have been updated. All previous sessions have been invalidated.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => navigate('/admin/login', { replace: true })}
                                    className="w-full mt-3 py-3 px-4 rounded-xl bg-primary-container hover:bg-[#236350] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <span>Sign In with New Password</span>
                                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="mb-6 flex flex-col gap-1.5">
                                    <div className="flex items-center gap-2 text-primary-fixed-dim text-[11px] font-bold uppercase tracking-wider">
                                        <span className="material-symbols-outlined text-[14px]">password</span>
                                        <span>Credential Reset</span>
                                    </div>
                                    <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
                                        Set New Admin Password
                                    </h1>
                                    <p className="text-xs text-slate-400">
                                        Choose a strong passphrase for your Atelier Super Admin account.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                                                lock
                                            </span>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                autoComplete="new-password"
                                                placeholder="••••••••••••"
                                                className={`w-full pl-10 pr-11 py-2.5 rounded-lg bg-[#0b1612] border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-fixed-dim transition-all ${
                                                    errors.newPassword ? 'border-error ring-1 ring-error' : 'border-[#234235] hover:border-[#35614e]'
                                                }`}
                                                {...register('newPassword')}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">
                                                    {showPassword ? 'visibility_off' : 'visibility'}
                                                </span>
                                            </button>
                                        </div>
                                        {errors.newPassword && (
                                            <span className="text-xs text-secondary-fixed-dim font-medium">{errors.newPassword.message}</span>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                                            Confirm New Password
                                        </label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                                                verified
                                            </span>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                autoComplete="new-password"
                                                placeholder="••••••••••••"
                                                className={`w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#0b1612] border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-fixed-dim transition-all ${
                                                    errors.confirmPassword ? 'border-error ring-1 ring-error' : 'border-[#234235] hover:border-[#35614e]'
                                                }`}
                                                {...register('confirmPassword')}
                                            />
                                        </div>
                                        {errors.confirmPassword && (
                                            <span className="text-xs text-secondary-fixed-dim font-medium">{errors.confirmPassword.message}</span>
                                        )}
                                    </div>

                                    {error && (
                                        <div className="p-3 rounded-lg bg-error/20 border border-error/40 flex items-start gap-2.5 text-xs text-rose-200">
                                            <span className="material-symbols-outlined text-[18px] text-secondary-fixed-dim shrink-0">
                                                error
                                            </span>
                                            <span>{error.data?.error?.message || 'Password reset failed. The link may have expired.'}</span>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full mt-2 py-3 px-4 rounded-xl bg-primary-container hover:bg-[#236350] active:scale-[0.99] text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                                                <span>Updating Credentials…</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined text-[18px]">lock_reset</span>
                                                <span>Save &amp; Invalidate Old Sessions</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </main>

            <footer className="relative z-10 w-full py-4 text-center text-[11px] text-slate-500">
                Minimog Atelier Console &middot; Proprietary Internal Administration
            </footer>
        </div>
    );
}

