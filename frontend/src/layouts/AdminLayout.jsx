import { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAdminLogoutMutation, useGetAdminVendorsQuery } from '../store/api/authApi';

export default function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const admin = useSelector((s) => s.auth.admin);
    const [adminLogout, { isLoading: isLoggingOut }] = useAdminLogoutMutation();
    const { data: vendorCountsData } = useGetAdminVendorsQuery({ status: 'pending' }, { skip: !admin });
    const pendingBadge = vendorCountsData?.data?.counts?.pending ?? 3;

    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() =>
        document.documentElement.classList.contains('dark')
    );

    const menuRef = useRef(null);
    const notifRef = useRef(null);

    // Close popovers on click outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setUserMenuOpen(false);
            }
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setNotifOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleTheme = () => {
        const next = !isDarkMode;
        setIsDarkMode(next);
        if (next) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const handleSignOut = async () => {
        try {
            await adminLogout().unwrap();
        } catch {
            // cleared in onQueryStarted
        } finally {
            navigate('/admin/login', { replace: true });
        }
    };

    const adminName = admin?.firstName
        ? `${admin.firstName} ${admin.lastName || ''}`.trim()
        : 'Henrik Vang';
    const adminRoleLabel = admin?.role === 'super_admin' ? 'Super Admin' : (admin?.role || 'Admin');
    const adminInitials = adminName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'HV';

    const navItemClass = ({ isActive }) =>
        `group flex items-center justify-between px-space-sm py-2 rounded-lg transition-all duration-150 ${
            isActive
                ? 'bg-primary-container text-on-primary font-bold shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
        }`;

    return (
        <div className="min-h-screen bg-surface font-sans text-on-surface antialiased flex flex-col">
            {/* ── Fixed Left Sidebar ──────────────────────────────────── */}
            <aside className="fixed left-0 top-0 h-screen w-72 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between overflow-y-auto">
                <div className="flex flex-col">
                    {/* Brand Banner */}
                    <div className="px-space-lg pt-space-lg pb-space-md">
                        <div className="flex items-center justify-between mb-space-xs">
                            <Link to="/admin/dashboard" className="flex items-center gap-space-sm group">
                                <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-on-primary shadow-sm group-hover:scale-105 transition-transform">
                                    <span className="material-symbols-outlined text-lg">spa</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight leading-none">
                                        Minimog
                                    </span>
                                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-[10px]">
                                        Atelier Console
                                    </span>
                                </div>
                            </Link>
                            <span className="px-space-xs py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                                Admin
                            </span>
                        </div>
                        <div className="mt-space-sm inline-flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm w-full">
                            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
                            <span className="truncate">Ops Node: Online · 14ms</span>
                        </div>
                    </div>

                    {/* Nav Items */}
                    <div className="px-space-sm py-space-xs">
                        <nav className="flex flex-col gap-space-xs">
                            {/* Core */}
                            <div className="px-space-sm pt-space-sm pb-space-xs">
                                <span className="font-label-sm text-label-sm uppercase text-outline tracking-wider font-semibold">
                                    Core
                                </span>
                            </div>
                            <NavLink to="/admin/dashboard" className={navItemClass}>
                                <div className="flex items-center gap-space-sm">
                                    <span className="material-symbols-outlined text-[20px]">dashboard</span>
                                    <span className="font-label-lg text-label-lg">Overview</span>
                                </div>
                            </NavLink>
                            <NavLink to="/admin/analytics" className={navItemClass}>
                                <div className="flex items-center gap-space-sm">
                                    <span className="material-symbols-outlined text-[20px]">trending_up</span>
                                    <span className="font-label-lg text-label-lg">Analytics &amp; GMV</span>
                                </div>
                            </NavLink>

                            {/* Commerce Operations */}
                            <div className="px-space-sm pt-space-md pb-space-xs">
                                <span className="font-label-sm text-label-sm uppercase text-outline tracking-wider font-semibold">
                                    Commerce Operations
                                </span>
                            </div>
                            <NavLink to="/admin/orders" className={navItemClass}>
                                <div className="flex items-center gap-space-sm">
                                    <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                                    <span className="font-label-lg text-label-lg">Orders &amp; Fulfillment</span>
                                </div>
                                <span className="px-space-xs py-0.5 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm font-semibold">
                                    14
                                </span>
                            </NavLink>
                            <NavLink to="/admin/products" className={navItemClass}>
                                <div className="flex items-center gap-space-sm">
                                    <span className="material-symbols-outlined text-[20px]">shelves</span>
                                    <span className="font-label-lg text-label-lg">Catalog &amp; Inventory</span>
                                </div>
                            </NavLink>
                            <NavLink to="/admin/customers" className={navItemClass}>
                                <div className="flex items-center gap-space-sm">
                                    <span className="material-symbols-outlined text-[20px]">groups</span>
                                    <span className="font-label-lg text-label-lg">Customers &amp; Patrons</span>
                                </div>
                            </NavLink>

                            {/* Ecosystem & Vendors */}
                            <div className="px-space-sm pt-space-md pb-space-xs">
                                <span className="font-label-sm text-label-sm uppercase text-outline tracking-wider font-semibold">
                                    Ecosystem &amp; Vendors
                                </span>
                            </div>
                            <NavLink to="/admin/vendors" className={navItemClass}>
                                <div className="flex items-center gap-space-sm">
                                    <span className="material-symbols-outlined text-[20px]">storefront</span>
                                    <span className="font-label-lg text-label-lg">Vendor Management</span>
                                </div>
                                <span className="px-space-xs py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-semibold">
                                    {pendingBadge} review
                                </span>
                            </NavLink>
                            <NavLink to="/admin/payouts" className={navItemClass}>
                                <div className="flex items-center gap-space-sm">
                                    <span className="material-symbols-outlined text-[20px]">payments</span>
                                    <span className="font-label-lg text-label-lg">Payouts &amp; Escrow</span>
                                </div>
                            </NavLink>

                            {/* Platform Governance */}
                            <div className="px-space-sm pt-space-md pb-space-xs">
                                <span className="font-label-sm text-label-sm uppercase text-outline tracking-wider font-semibold">
                                    Platform Governance
                                </span>
                            </div>
                            <NavLink to="/admin/security" className={navItemClass}>
                                <div className="flex items-center gap-space-sm">
                                    <span className="material-symbols-outlined text-[20px]">shield</span>
                                    <span className="font-label-lg text-label-lg">Security &amp; Telemetry</span>
                                </div>
                            </NavLink>
                            <NavLink to="/admin/settings" className={navItemClass}>
                                <div className="flex items-center gap-space-sm">
                                    <span className="material-symbols-outlined text-[20px]">tune</span>
                                    <span className="font-label-lg text-label-lg">Settings &amp; ESG</span>
                                </div>
                            </NavLink>
                        </nav>
                    </div>
                </div>

                {/* Sidebar Footer */}
                <div className="px-space-md pb-space-lg pt-space-md flex flex-col gap-space-md">
                    {/* Cloud Sync Meter */}
                    <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-space-xs">
                        <div className="flex items-center justify-between font-label-sm text-label-sm">
                            <span className="text-on-surface-variant flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">cloud_sync</span> Cloud Sync
                            </span>
                            <span className="font-semibold text-primary">98.2%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden">
                            <div className="h-full bg-primary-container rounded-full w-[98.2%]"></div>
                        </div>
                    </div>

                    {/* Admin User Card & Popover */}
                    <div className="relative" ref={menuRef}>
                        <div className="p-space-sm rounded-xl bg-surface-container-low flex items-center justify-between">
                            <div className="flex items-center gap-space-sm min-w-0">
                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                                    <span className="text-xs font-bold text-on-primary">{adminInitials}</span>
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="font-label-md text-label-md text-on-surface font-semibold truncate">
                                        {adminName}
                                    </span>
                                    <span className="font-label-sm text-label-sm text-on-surface-variant truncate">
                                        {adminRoleLabel}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-on-surface-variant">
                                <button
                                    type="button"
                                    aria-label="Account settings"
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="p-1 hover:text-on-surface transition-colors cursor-pointer rounded"
                                >
                                    <span className="material-symbols-outlined text-[18px]">more_vert</span>
                                </button>
                            </div>
                        </div>

                        {/* Dropdown Menu */}
                        {userMenuOpen && (
                            <div className="absolute bottom-full left-0 right-0 mb-2 p-2 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/40 flex flex-col gap-1 z-50">
                                <div className="px-3 py-2 border-b border-surface-container">
                                    <p className="text-xs font-semibold text-on-surface truncate">{adminName}</p>
                                    <p className="text-[11px] text-on-surface-variant truncate">
                                        {admin?.email || 'admin@marketplace.local'}
                                    </p>
                                </div>
                                <Link
                                    to="/admin/settings"
                                    onClick={() => setUserMenuOpen(false)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-on-surface hover:bg-surface-container transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[16px]">manage_accounts</span>
                                    <span>Console Preferences</span>
                                </Link>
                                <button
                                    type="button"
                                    onClick={handleSignOut}
                                    disabled={isLoggingOut}
                                    className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-error hover:bg-error-container/30 transition-colors cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-[16px]">logout</span>
                                    <span>{isLoggingOut ? 'Signing out…' : 'Sign Out of Console'}</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* ── Fixed Top Header ────────────────────────────────────── */}
            <div className="pl-72 flex flex-col min-h-screen">
                <header className="fixed top-0 left-72 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-space-lg">
                    {/* Search Bar */}
                    <div className="w-full max-w-md">
                        <div className="relative flex items-center">
                            <span className="material-symbols-outlined absolute left-3 text-outline text-[18px]">
                                search
                            </span>
                            <input
                                className="w-full pl-9 pr-14 py-2 bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface placeholder-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary-container transition-all"
                                placeholder="Search orders, SKUs, artisan studios, or telemetry..."
                                type="text"
                            />
                            <kbd className="absolute right-2 px-1.5 py-0.5 text-[10px] font-label-sm text-outline bg-surface-container rounded select-none">
                                ⌘K
                            </kbd>
                        </div>
                    </div>

                    {/* Right Toolbar */}
                    <div className="flex items-center gap-space-md">
                        {/* Ops Production Tag */}
                        <div className="hidden lg:flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-surface-container-low text-on-surface font-label-sm text-label-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></span>
                            <span>Production EU-North-1</span>
                        </div>

                        {/* Storefront Link */}
                        <a
                            className="hidden sm:flex items-center gap-1 px-space-sm py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors"
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                            <span>Live Storefront</span>
                        </a>

                        {/* Notifications */}
                        <div className="relative" ref={notifRef}>
                            <button
                                type="button"
                                aria-label="Notifications"
                                onClick={() => setNotifOpen(!notifOpen)}
                                className="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[20px]">notifications</span>
                                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-secondary ring-2 ring-surface-container-lowest"></span>
                            </button>

                            {notifOpen && (
                                <div className="absolute right-0 top-full mt-2 w-80 p-3 bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/40 flex flex-col gap-2 z-50">
                                    <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                                        <span className="font-semibold text-xs text-on-surface uppercase tracking-wider">
                                            Telemetry Alerts
                                        </span>
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-bold">
                                            2 Active
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                                        <div className="p-2 rounded-lg bg-surface-container-low text-xs flex flex-col gap-1">
                                            <div className="flex items-center justify-between font-semibold text-on-surface">
                                                <span>Artisan Payout Escrow</span>
                                                <span className="text-[10px] text-outline">4m ago</span>
                                            </div>
                                            <p className="text-on-surface-variant text-[11px]">
                                                Automated Stripe Connect batch scheduled in 4 hours ($199.1k).
                                            </p>
                                        </div>
                                        <div className="p-2 rounded-lg bg-surface-container-low text-xs flex flex-col gap-1">
                                            <div className="flex items-center justify-between font-semibold text-on-surface">
                                                <span>Nordic Hub Surge</span>
                                                <span className="text-[10px] text-outline">18m ago</span>
                                            </div>
                                            <p className="text-on-surface-variant text-[11px]">
                                                482 parcels routed through Copenhagen atelier hub. Capacity 99.1% nominal.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Theme Toggle */}
                        <button
                            type="button"
                            aria-label="Toggle theme"
                            onClick={toggleTheme}
                            className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[20px]">
                                {isDarkMode ? 'dark_mode' : 'light_mode'}
                            </span>
                        </button>

                        {/* Admin Avatar */}
                        <div
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                            className="relative cursor-pointer"
                            title={adminName}
                        >
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-xs text-on-primary">
                                {adminInitials}
                            </div>
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-primary-container ring-2 ring-surface-container-lowest"></span>
                        </div>
                    </div>
                </header>

                {/* ── Page Content Outlet ──────────────────────────────── */}
                <Outlet />
            </div>
        </div>
    );
}