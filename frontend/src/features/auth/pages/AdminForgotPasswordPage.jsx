import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'react-router-dom';

import { forgotPasswordSchema } from '../schemas';
import { useAdminForgotPasswordMutation } from '../../../store/api/authApi';

export default function AdminForgotPasswordPage() {
    const [adminForgotPassword, { isLoading }] = useAdminForgotPasswordMutation();
    const [submittedEmail, setSubmittedEmail] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(forgotPasswordSchema),
        mode: 'onBlur',
    });

    const onSubmit = async (values) => {
        try {
            await adminForgotPassword(values).unwrap();
        } catch {
            // Backend returns success message or silently succeeds for security
        }
        setSubmittedEmail(values.email);
    };

    return (
        <div className="min-h-screen bg-[#070f0c] text-white flex flex-col justify-between relative overflow-hidden select-none">
            {/* Ambient Glow */}
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
                    <span>Back to Sign In</span>
                </Link>
            </header>

            {/* Main Form Container */}
            <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-md">
                    <div className="rounded-2xl bg-[#0f1d17]/95 border border-[#203a2e] shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl p-7 sm:p-9 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-fixed-dim to-transparent opacity-60" />

                        {submittedEmail ? (
                            <div className="flex flex-col items-center text-center gap-4 py-2">
                                <div className="w-14 h-14 rounded-2xl bg-primary-container/60 border border-primary-container flex items-center justify-center text-primary-fixed-dim">
                                    <span className="material-symbols-outlined text-[28px]">mark_email_read</span>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <h1 className="text-xl font-bold text-white">Recovery Link Dispatched</h1>
                                    <p className="text-xs text-slate-300 max-w-xs leading-relaxed">
                                        If an administrator record matches <span className="text-primary-fixed font-semibold">{submittedEmail}</span>, a secure password reset link has been dispatched.
                                    </p>
                                </div>
                                <div className="w-full p-3 rounded-lg bg-[#0a1410] border border-[#1e382c] text-xs text-slate-400 text-left flex items-start gap-2 mt-2">
                                    <span className="material-symbols-outlined text-[16px] text-primary-fixed-dim shrink-0 mt-0.5">info</span>
                                    <span>In development, reset emails are captured in Mailpit at localhost port 8025.</span>
                                </div>
                                <Link
                                    to="/admin/login"
                                    className="w-full mt-3 py-2.5 px-4 rounded-xl bg-primary-container hover:bg-[#236350] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                                    <span>Return to Admin Sign In</span>
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="mb-6 flex flex-col gap-1.5">
                                    <div className="flex items-center gap-2 text-primary-fixed-dim text-[11px] font-bold uppercase tracking-wider">
                                        <span className="material-symbols-outlined text-[14px]">lock_reset</span>
                                        <span>Security Recovery</span>
                                    </div>
                                    <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
                                        Reset Admin Password
                                    </h1>
                                    <p className="text-xs text-slate-400">
                                        Enter your registered administrator email to receive a secure recovery URL.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                                            Admin Email Address
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

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full mt-2 py-3 px-4 rounded-xl bg-primary-container hover:bg-[#236350] active:scale-[0.99] text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                                                <span>Issuing Recovery Link…</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined text-[18px]">send</span>
                                                <span>Send Recovery Link</span>
                                            </>
                                        )}
                                    </button>
                                </form>

                                <div className="mt-6 pt-5 border-t border-[#1d352b] text-center">
                                    <Link
                                        to="/admin/login"
                                        className="text-xs text-slate-400 hover:text-primary-fixed-dim transition-colors inline-flex items-center gap-1"
                                    >
                                        <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                                        <span>Back to Admin Authentication</span>
                                    </Link>
                                </div>
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

