import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Icon from '../components/ui/Icon';
import ThemeToggle from '../components/ui/ThemeToggle';
import { useLogoutMutation } from '../store/api/authApi';

/* ── Nav definition ─────────────────────────────────────── */

const NAV_GROUPS = [
    {
        heading: 'Overview',
        links: [
            { to: '/vendor/dashboard', icon: 'dashboard',    label: 'Dashboard' },
            { to: '/vendor/orders',    icon: 'receipt_long', label: 'Orders', badge: 3 },
        ],
    },
    {
        heading: 'Catalog',
        links: [
            { to: '/vendor/products',     icon: 'inventory_2', label: 'Products' },
            { to: '/vendor/products/new', icon: 'add_box',     label: 'Add Product' },
            { to: '/vendor/reviews',      icon: 'star',        label: 'Reviews' },
        ],
    },
    {
        heading: 'Account',
        links: [
            { to: '/vendor/settings/profile', icon: 'storefront', label: 'Store Profile' },
            { to: '/vendor/settings/payouts', icon: 'payments',   label: 'Payouts' },
            { to: '/vendor/reports',          icon: 'bar_chart',  label: 'Reports' },
        ],
    },
];

/* ── Sidebar ────────────────────────────────────────────── */

function SidebarNav({ onNavigate }) {
    return (
        <nav className="flex-1 overflow-y-auto p-space-md flex flex-col gap-space-lg">
            {NAV_GROUPS.map((group) => (
                <div key={group.heading}>
                    <p className="px-3 mb-1.5 text-label-sm uppercase tracking-widest text-on-surface-variant font-bold">
                        {group.heading}
                    </p>
                    <ul className="flex flex-col gap-0.5">
                        {group.links.map((link) => (
                            <li key={link.to}>
                                <NavLink
                                    to={link.to}
                                    end={link.to === '/vendor/dashboard'}
                                    onClick={onNavigate}
                                    className={({ isActive }) =>
                                        `flex items-center gap-space-sm px-3 py-2 rounded-lg text-label-md transition-colors ${
                                            isActive
                                                ? 'bg-primary-container/10 text-primary-container font-bold'
                                                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <Icon
                                                name={link.icon}
                                                size={19}
                                                filled={isActive}
                                                className={isActive ? 'text-primary-container' : ''}
                                            />
                                            <span className="flex-1">{link.label}</span>
                                            {link.badge && (
                                                <span className="ml-auto min-w-[20px] h-5 px-1.5 rounded-full bg-secondary text-on-secondary text-[10px] leading-none font-bold flex items-center justify-center">
                                                    {link.badge}
                                                </span>
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}

            <div className="mt-auto rounded-xl bg-primary-container text-on-primary p-space-md">
                <div className="flex items-center gap-2">
                    <Icon name="support_agent" size={18} />
                    <span className="text-label-md font-bold">Need a hand?</span>
                </div>
                <p className="text-body-sm text-on-primary-container mt-1 leading-relaxed">
                    Reach our vendor support team any time.
                </p>
                <Link
                    to="/contact"
                    className="mt-3 inline-flex items-center gap-1 text-label-sm font-bold uppercase tracking-wider text-primary-fixed hover:text-primary-fixed-dim transition-colors"
                >
                    Contact Support
                    <Icon name="arrow_forward" size={14} />
                </Link>
            </div>
        </nav>
    );
}

/* ── User menu ──────────────────────────────────────────── */

function UserMenu() {
    const user = useSelector((s) => s.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [logout] = useLogoutMutation();

    const vendor = user?.vendor;
    const businessName = vendor?.businessName || 'Your Store';
    const initials =
        (user?.firstName?.[0] || '') + (user?.lastName?.[0] || '') ||
        businessName[0] ||
        'V';

    const onLogout = async () => {
        try { await logout().unwrap(); } catch { /* ignore */ }
        navigate('/login', { replace: true });
    };

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-space-sm pl-1 pr-2.5 py-1 rounded-full hover:bg-surface-container transition-colors"
            >
                <span className="w-9 h-9 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-[13px] uppercase">
                    {initials.toUpperCase()}
                </span>
                <span className="hidden md:flex flex-col items-start leading-tight">
                    <span className="text-label-md text-on-surface font-semibold max-w-[160px] truncate">
                        {businessName}
                    </span>
                    <span className="text-label-sm text-on-surface-variant uppercase tracking-wider">
                        Vendor
                    </span>
                </span>
                <Icon name="expand_more" size={18} className="text-on-surface-variant" />
            </button>

            {open && (
                <>
                    {/* click-away */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setOpen(false)}
                        aria-hidden="true"
                    />
                    <div className="absolute right-0 top-full mt-2 w-60 rounded-xl bg-surface-container-lowest shadow-lg border border-outline-variant/50 py-1.5 z-50">
                        <div className="px-space-md py-space-sm border-b border-outline-variant/50">
                            <p className="text-label-md text-on-surface font-semibold truncate">
                                {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-body-sm text-on-surface-variant truncate">
                                {user?.email}
                            </p>
                        </div>
                        <Link
                            to="/vendor/settings/profile"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-space-sm px-3 py-2 text-label-md text-on-surface hover:bg-surface-container transition-colors"
                        >
                            <Icon name="storefront" size={18} />
                            Store profile
                        </Link>
                        <Link
                            to="/vendor/settings/payouts"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-space-sm px-3 py-2 text-label-md text-on-surface hover:bg-surface-container transition-colors"
                        >
                            <Icon name="payments" size={18} />
                            Payout settings
                        </Link>
                        <Link
                            to="/"
                            className="flex items-center gap-space-sm px-3 py-2 text-label-md text-on-surface hover:bg-surface-container transition-colors"
                        >
                            <Icon name="visibility" size={18} />
                            View storefront
                        </Link>
                        <hr className="my-1.5 border-outline-variant/50" />
                        <button
                            type="button"
                            onClick={onLogout}
                            className="w-full flex items-center gap-space-sm px-3 py-2 text-label-md text-error hover:bg-error-container/40 transition-colors"
                        >
                            <Icon name="logout" size={18} />
                            Sign out
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

/* ── Layout ─────────────────────────────────────────────── */

export default function VendorLayout() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-background">
            {/* ── Desktop sidebar ─────────────────────── */}
            <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-outline-variant bg-surface-container-lowest">
                <Link
                    to="/vendor/dashboard"
                    className="h-20 flex items-center gap-space-sm px-space-lg border-b border-outline-variant"
                >
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm">
                        <Icon name="shopping_bag" size={22} />
                    </div>
                    <div className="flex flex-col leading-tight">
                        <span className="text-headline-sm text-on-surface font-bold tracking-tight">
                            Marketplace
                        </span>
                        <span className="text-label-sm text-on-surface-variant font-medium">
                            Vendor Studio
                        </span>
                    </div>
                </Link>
                <SidebarNav />
            </aside>

            {/* ── Mobile drawer ───────────────────────── */}
            {mobileOpen && (
                <>
                    <div
                        className="lg:hidden fixed inset-0 bg-black/40 z-40"
                        onClick={() => setMobileOpen(false)}
                        aria-hidden="true"
                    />
                    <aside className="lg:hidden fixed inset-y-0 left-0 w-64 z-50 flex flex-col bg-surface-container-lowest border-r border-outline-variant">
                        <div className="h-20 flex items-center justify-between px-space-lg border-b border-outline-variant">
                            <Link to="/vendor/dashboard" className="flex items-center gap-space-sm">
                                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary">
                                    <Icon name="shopping_bag" size={22} />
                                </div>
                                <span className="text-headline-sm font-bold">Marketplace</span>
                            </Link>
                            <button
                                type="button"
                                aria-label="Close menu"
                                onClick={() => setMobileOpen(false)}
                                className="w-9 h-9 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant"
                            >
                                <Icon name="close" size={20} />
                            </button>
                        </div>
                        <SidebarNav onNavigate={() => setMobileOpen(false)} />
                    </aside>
                </>
            )}

            {/* ── Main column ─────────────────────────── */}
            <div className="flex-1 min-w-0 flex flex-col">
                {/* Topbar */}
                <header className="h-20 sticky top-0 z-30 flex items-center justify-between gap-space-md border-b border-outline-variant bg-surface-container-lowest/85 backdrop-blur-xl px-margin-mobile md:px-space-lg">
                    <div className="flex items-center gap-space-sm">
                        <button
                            type="button"
                            aria-label="Open menu"
                            onClick={() => setMobileOpen(true)}
                            className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
                        >
                            <Icon name="menu" size={22} />
                        </button>

                        <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container-low text-on-surface-variant">
                            <Icon name="search" size={18} />
                            <input
                                type="search"
                                placeholder="Search orders, products…"
                                className="bg-transparent outline-none border-0 text-body-md placeholder:text-on-surface-variant w-56"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-space-xs md:gap-space-sm">
                        <ThemeToggle />

                        <button
                            type="button"
                            aria-label="Notifications"
                            className="relative w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
                        >
                            <Icon name="notifications" size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-secondary ring-2 ring-surface-container-lowest" />
                        </button>

                        <button
                            type="button"
                            aria-label="Messages"
                            className="w-10 h-10 rounded-full hidden sm:flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
                        >
                            <Icon name="chat_bubble" size={20} />
                        </button>

                        <UserMenu />
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-margin-mobile md:p-space-lg">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}