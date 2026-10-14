import { Link, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function PublicLayout() {
    const { isAuthenticated, user } = useSelector((s) => s.auth);

    return (
        <div className="flex min-h-screen flex-col">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                    <Link to="/" className="text-lg font-semibold text-brand-700">
                        Marketplace
                    </Link>

                    <nav className="flex items-center gap-4 text-sm">
                        <Link to="/cart" className="hover:text-brand-600">Cart</Link>
                        {isAuthenticated ? (
                            <Link to="/account" className="hover:text-brand-600">
                                {user?.firstName || 'Account'}
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="hover:text-brand-600">Log in</Link>
                                <Link
                                    to="/register"
                                    className="rounded-md bg-brand-600 px-3 py-1.5 text-white hover:bg-brand-700"
                                >
                                    Sign up
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            <main className="flex-1">
                <Outlet />
            </main>

            <footer className="border-t border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-slate-500">
                    © {new Date().getFullYear()} Marketplace — Phase 0 scaffold
                </div>
            </footer>
        </div>
    );
}