import { Link } from 'react-router-dom';
import AdminLoginForm from '../AdminLoginForm';

export default function AdminLoginPage() {
    return (
        <div className="min-h-screen bg-[#070f0c] text-white flex flex-col justify-between relative overflow-hidden select-none">
            {/* Background Ambient Lighting & Grid */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary-container/25 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-20 right-0 w-[500px] h-[300px] bg-primary-fixed-dim/10 blur-[100px] rounded-full pointer-events-none" />

            {/* Top Bar Navigation */}
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

                <div className="flex items-center gap-3">
                    <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#11231c] border border-[#1e3c2f] text-xs text-primary-fixed-dim">
                        <span className="w-2 h-2 rounded-full bg-primary-container animate-ping" />
                        <span>Ops Node: Online · 14ms (EU-North-1)</span>
                    </div>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white transition-colors px-2.5 py-1 rounded-lg hover:bg-white/5"
                    >
                        <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                        <span>Storefront</span>
                    </Link>
                </div>
            </header>

            {/* Main Center Sign In Card */}
            <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-md">
                    <div className="rounded-2xl bg-[#0f1d17]/95 border border-[#203a2e] shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl p-7 sm:p-9 relative overflow-hidden">
                        {/* Top subtle highlight line */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-fixed-dim to-transparent opacity-60" />

                        {/* Console Badge & Header */}
                        <div className="mb-6 flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-container/60 text-primary-fixed-dim text-[11px] font-bold tracking-wider uppercase border border-primary-container">
                                    <span className="material-symbols-outlined text-[13px]">shield</span>
                                    Super Admin Portal
                                </span>
                                <span className="text-[11px] text-slate-400 font-mono">v2.4 Atelier</span>
                            </div>
                            <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
                                Executive Sign In
                            </h1>
                            <p className="text-xs text-slate-400">
                                Restricted operations, artisan financial ledger &amp; telemetry console.
                            </p>
                        </div>

                        {/* Admin Login Form */}
                        <AdminLoginForm />

                        {/* Security Disclaimer */}
                        <div className="mt-6 pt-5 border-t border-[#1d352b] text-center">
                            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                                <span className="material-symbols-outlined text-[14px] text-primary-fixed-dim">verified_user</span>
                                <span>256-bit Encrypted Session · No Public Registration</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom hint to vendor or customer login */}
                    <div className="mt-5 text-center text-xs text-slate-400 flex items-center justify-center gap-3">
                        <Link to="/login" className="hover:text-primary-fixed-dim transition-colors">
                            Customer Login
                        </Link>
                        <span>&middot;</span>
                        <Link to="/vendor/login" className="hover:text-primary-fixed-dim transition-colors">
                            Vendor Portal
                        </Link>
                        <span>&middot;</span>
                        <Link to="/admin/forgot-password" className="hover:text-primary-fixed-dim transition-colors">
                            Reset Passphrase
                        </Link>
                    </div>
                </div>
            </main>

            {/* Subtle Footer */}
            <footer className="relative z-10 w-full py-4 text-center text-[11px] text-slate-500">
                Minimog Atelier Console &middot; Proprietary Internal Administration &middot; EU-North-1 Production
            </footer>
        </div>
    );
}