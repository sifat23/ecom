import AuthFormShell from '../AuthFormShell';
import AdminLoginForm from '../AdminLoginForm';

export default function AdminLoginPage() {
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="rounded-2xl bg-white shadow-xl p-8 sm:p-10">
                    <div className="mb-6">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                            Admin console
                        </p>
                        <h1 className="mt-1 text-2xl font-bold text-slate-900">Sign in</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Restricted access. All actions are logged.
                        </p>
                    </div>
                    <AdminLoginForm />
                </div>
            </div>
        </div>
    );
}