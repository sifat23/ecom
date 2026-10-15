import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Icon from '../ui/Icon';
import ThemeToggle from '../ui/ThemeToggle';

/* ── Nav config ─────────────────────────────────────────── */

const NAV = [
    { label: 'Home', to: '/' },
    { label: 'Shop', to: '/search', mega: true },
    { label: 'Collections', to: '/collections' },
    { label: 'Best Sellers', to: '/search?sort=best' },
    { label: 'New Arrivals', to: '/search?sort=new' },
];

const SHOP_CATEGORIES = [
    { name: "Men's Fashion", slug: 'mens-fashion', icon: 'styler' },
    { name: "Women's Fashion", slug: 'womens-fashion', icon: 'checkroom' },
    { name: 'Footwear', slug: 'footwear', icon: 'steps' },
    { name: 'Watches', slug: 'watches', icon: 'watch' },
    { name: 'Bags', slug: 'bags', icon: 'work' },
    { name: 'Accessories', slug: 'accessories', icon: 'diamond' },
    { name: 'Home & Living', slug: 'home-living', icon: 'chair' },
    { name: 'Beauty & Care', slug: 'beauty-care', icon: 'spa' },
];

const FEATURED_LINKS = [
    { label: 'New Arrivals', to: '/search?sort=new' },
    { label: 'Best Sellers', to: '/search?sort=best' },
    { label: 'Sale Items', to: '/search?tag=sale' },
    { label: 'Gift Cards', to: '/gift-cards' },
];

function isNavActive(item, location) {
    const [itemPath, itemQuery] = item.to.split('?');
    const currentPath = location.pathname;

    // Path must match exactly
    if (itemPath === '/') return currentPath === '/';
    if (currentPath !== itemPath) return false;

    // No query in the nav item → active whenever the path matches
    if (!itemQuery) return true;

    // Compare query params (order-independent)
    const itemParams = new URLSearchParams(itemQuery);
    const currentParams = new URLSearchParams(location.search);

    for (const [key, value] of itemParams.entries()) {
        if (currentParams.get(key) !== value) return false;
    }
    return true;
}

/* ── Mega menu (desktop) ────────────────────────────────── */

function ShopMega({ onMouseEnter, onMouseLeave, onClose }) {
    return (
        <div
            data-shop-mega
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className="absolute left-0 right-0 top-full bg-surface-container-lowest shadow-[0_8px_24px_rgba(0,0,0,0.06)] border-t border-outline-variant/40 animate-in"
        >
            <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin py-space-lg grid grid-cols-12 gap-space-lg">

                {/* ── Categories (8 cols) ──────────────────── */}
                <div className="col-span-8">
                    <div className="flex items-center justify-between mb-space-md">
                        <p className="text-label-sm uppercase tracking-widest text-on-surface-variant font-bold">
                            Shop by Category
                        </p>
                        <Link
                            to="/search"
                            onClick={onClose}
                            className="text-label-md font-bold text-primary-container hover:underline inline-flex items-center gap-1"
                        >
                            View all products
                            <Icon name="arrow_forward" size={14} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-x-space-lg gap-y-1">
                        {SHOP_CATEGORIES.map((cat) => (
                            <Link
                                key={cat.slug}
                                to={`/category/${cat.slug}`}
                                onClick={onClose}
                                className="group flex items-center gap-space-sm p-2 rounded-lg hover:bg-surface-container-low transition-colors"
                            >
                                <span className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary-container shrink-0 group-hover:bg-primary-container group-hover:text-on-primary transition-colors">
                                    <Icon name={cat.icon} size={18} />
                                </span>
                                <span className="text-label-md font-semibold text-on-surface group-hover:text-primary-container transition-colors truncate">
                                    {cat.name}
                                </span>
                                <Icon
                                    name="arrow_forward"
                                    size={14}
                                    className="ml-auto text-outline opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                                />
                            </Link>
                        ))}
                    </div>

                    {/* Quick links row */}
                    <div className="mt-space-md pt-space-md border-t border-outline-variant/40 flex flex-wrap items-center gap-x-space-md gap-y-2">
                        {FEATURED_LINKS.map((l) => (
                            <Link
                                key={l.label}
                                to={l.to}
                                onClick={onClose}
                                className="text-label-md text-on-surface-variant hover:text-primary-container font-medium transition-colors"
                            >
                                {l.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* ── Featured card (4 cols) ───────────────── */}
                <div className="col-span-4">
                    <p className="text-label-sm uppercase tracking-widest text-on-surface-variant font-bold mb-space-md">
                        Featured
                    </p>
                    <Link
                        to="/search?tag=sale"
                        onClick={onClose}
                        className="block relative rounded-xl overflow-hidden group h-[calc(100%-2.5rem)]"
                    >
                        {/* Placeholder gradient — swap for an <img> of your hero product */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-container via-primary to-primary-container" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                        {/* Decorative icon */}
                        <Icon
                            name="local_offer"
                            size={90}
                            className="absolute top-4 right-4 text-white/10"
                        />

                        <div className="relative h-full p-space-md flex flex-col justify-end min-h-[200px]">
                            <span className="inline-flex self-start items-center gap-1 px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold uppercase tracking-widest mb-2">
                                Limited Time
                            </span>
                            <p className="text-headline-md font-bold text-white leading-tight">
                                Spring Sale is Live
                            </p>
                            <p className="text-body-sm text-white/80 mt-0.5">
                                Up to 30% off seasonal bestsellers
                            </p>
                            <span className="mt-3 inline-flex items-center gap-1 text-label-md font-bold text-white group-hover:gap-2 transition-all">
                                Shop the sale
                                <Icon name="arrow_forward" size={14} />
                            </span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}

/* ── Mobile shop accordion ──────────────────────────────── */

function MobileShopAccordion({ open, onToggle, onNavigate }) {
    return (
        <div className="border-b border-outline-variant last:border-0">
            <button
                type="button"
                onClick={onToggle}
                className="w-full py-3 flex items-center justify-between text-label-lg text-on-surface-variant font-semibold"
            >
                <span>Shop</span>
                <Icon
                    name="expand_more"
                    size={20}
                    className={`transition-transform ${open ? 'rotate-180' : ''}`}
                />
            </button>

            {open && (
                <div className="pb-space-md flex flex-col gap-0.5">
                    {SHOP_CATEGORIES.map((cat) => (
                        <Link
                            key={cat.slug}
                            to={`/category/${cat.slug}`}
                            onClick={onNavigate}
                            className="flex items-center gap-space-sm px-3 py-2 rounded-lg text-label-md text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
                        >
                            <Icon name={cat.icon} size={18} className="text-primary-container" />
                            {cat.name}
                        </Link>
                    ))}
                    <div className="mt-2 pt-2 border-t border-outline-variant/50 flex flex-col gap-0.5">
                        {FEATURED_LINKS.map((l) => (
                            <Link
                                key={l.label}
                                to={l.to}
                                onClick={onNavigate}
                                className="px-3 py-2 rounded-lg text-label-md text-primary-container font-semibold hover:bg-surface-container-low transition-colors"
                            >
                                {l.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

/* ── Header ─────────────────────────────────────────────── */

export default function SiteHeader() {
    const location = useLocation();
    const user = useSelector((s) => s.auth.user);
    const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);

    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileShopOpen, setMobileShopOpen] = useState(false);
    const [shopOpen, setShopOpen] = useState(false);
    const closeTimer = useRef(null);

    // Close everything on route change
    useEffect(() => {
        setMobileOpen(false);
        setShopOpen(false);
        setMobileShopOpen(false);
    }, [location.pathname, location.search]);

    // Close shop mega on click outside
    useEffect(() => {
        if (!shopOpen) return;
        const handler = (e) => {
            if (!e.target.closest('[data-shop-mega]') && !e.target.closest('[data-shop-trigger]')) {
                setShopOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [shopOpen]);

    const openShop = () => { clearTimeout(closeTimer.current); setShopOpen(true); };
    const closeShop = () => { closeTimer.current = setTimeout(() => setShopOpen(false), 150); };

    // Account destination based on auth state + role
    const accountLink = (() => {
        if (!isAuthenticated) return '/login';
        if (user?.role === 'vendor') {
            const s = user.vendor?.status;
            if (s === 'approved') return '/vendor/dashboard';
            if (s === 'rejected') return '/vendor/rejected';
            return '/vendor/pending';
        }
        return '/account';
    })();

    return (
        <header className="sticky top-0 z-50 w-full bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
            <div className="h-20 max-w-7xl mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin flex items-center justify-between gap-space-md">

                {/* ── Logo ─────────────────────────────────── */}
                <Link to="/" className="flex items-center gap-space-sm group shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm transition-transform group-hover:scale-105">
                        <Icon name="shopping_bag" size={22} />
                    </div>
                    <div className="flex flex-col leading-tight">
                        <span className="text-headline-sm text-on-surface font-bold tracking-tight">
                            Marketplace
                        </span>
                        <span className="text-label-sm text-on-surface-variant font-medium">
                            Multi-Vendor Store
                        </span>
                    </div>
                </Link>

                {/* ── Desktop nav ──────────────────────────── */}
                <nav className="hidden xl:flex items-center gap-space-lg">
                    {NAV.map((item) => {
                        const active = item.mega
                            ? location.pathname.startsWith('/search') ||
                            location.pathname.startsWith('/category') ||
                            location.pathname === '/collections'
                            : isNavActive(item, location);

                        const baseCls = active
                            ? 'text-primary font-bold after:content-[""] after:block after:w-full after:h-0.5 after:bg-primary after:mt-1 after:rounded-full'
                            : 'text-on-surface-variant hover:text-on-surface';

                        if (item.mega) {
                            return (
                                <div
                                    key={item.label}
                                    data-shop-trigger
                                    className="relative"
                                    onMouseEnter={openShop}
                                    onMouseLeave={closeShop}
                                >
                                    <button
                                        type="button"
                                        onClick={() => setShopOpen((v) => !v)}
                                        className={`inline-flex items-center gap-1 py-1 transition-colors text-label-lg ${baseCls}`}
                                    >
                                        {item.label}
                                        <Icon
                                            name="expand_more"
                                            size={16}
                                            className={`transition-transform duration-200 ${shopOpen ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={item.label}
                                to={item.to}
                                className={`py-1 transition-colors text-label-lg ${baseCls}`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* ── Actions ──────────────────────────────── */}
                <div className="flex items-center gap-space-sm md:gap-space-md">
                    <Link
                        to="/search"
                        aria-label="Search store"
                        className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
                    >
                        <Icon name="search" />
                    </Link>

                    <div className="hidden sm:block">
                        <ThemeToggle />
                    </div>

                    <Link
                        to={accountLink}
                        aria-label="Account"
                        className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
                    >
                        <Icon name="account_circle" />
                    </Link>

                    <Link
                        to="/cart"
                        aria-label="Shopping cart"
                        className="relative w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
                    >
                        <Icon name="shopping_cart" />
                        <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] rounded-full bg-secondary text-on-secondary text-[10px] leading-none flex items-center justify-center font-bold shadow-sm ring-2 ring-surface-container-lowest">
                            2
                        </span>
                    </Link>

                    <button
                        type="button"
                        aria-label="Open menu"
                        onClick={() => setMobileOpen((v) => !v)}
                        className="xl:hidden w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
                    >
                        <Icon name={mobileOpen ? 'close' : 'menu'} />
                    </button>
                </div>
            </div>

            {/* ── Desktop mega menu ────────────────────────── */}
            {shopOpen && (
                <ShopMega
                    onMouseEnter={openShop}
                    onMouseLeave={closeShop}
                    onClose={() => setShopOpen(false)}
                />
            )}

            {/* ── Mobile drawer ────────────────────────────── */}
            {mobileOpen && (
                <nav className="xl:hidden border-t border-outline-variant bg-surface-container-lowest max-h-[calc(100vh-5rem)] overflow-y-auto">
                    <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-tablet py-space-md flex flex-col">

                        {/* Home */}
                        <NavLink
                            to="/"
                            end
                            onClick={() => setMobileOpen(false)}
                            className={({ isActive }) =>
                                `py-3 border-b border-outline-variant text-label-lg ${isActive ? 'text-primary font-bold' : 'text-on-surface-variant'
                                }`
                            }
                        >
                            Home
                        </NavLink>

                        {/* Shop accordion */}
                        <MobileShopAccordion
                            open={mobileShopOpen}
                            onToggle={() => setMobileShopOpen((v) => !v)}
                            onNavigate={() => setMobileOpen(false)}
                        />

                        {/* Remaining links */}
                        {['Collections', 'Best Sellers', 'New Arrivals'].map((label) => {
                            const item = NAV.find((n) => n.label === label);
                            return (
                                <NavLink
                                    key={label}
                                    to={item.to}
                                    onClick={() => setMobileOpen(false)}
                                    className={({ isActive }) =>
                                        `py-3 border-b border-outline-variant last:border-0 text-label-lg ${isActive ? 'text-primary font-bold' : 'text-on-surface-variant'
                                        }`
                                    }
                                >
                                    {label}
                                </NavLink>
                            );
                        })}

                        {/* Extra account shortcuts on mobile */}
                        <div className="pt-space-md mt-space-sm border-t border-outline-variant flex flex-col gap-1">
                            {!isAuthenticated ? (
                                <>
                                    <Link
                                        to="/login"
                                        onClick={() => setMobileOpen(false)}
                                        className="py-2 text-label-md text-primary font-semibold hover:underline"
                                    >
                                        Customer Sign In
                                    </Link>
                                    <Link
                                        to="/vendor/login"
                                        onClick={() => setMobileOpen(false)}
                                        className="py-2 text-label-md text-on-surface-variant hover:text-on-surface"
                                    >
                                        Vendor Portal Sign In
                                    </Link>
                                </>
                            ) : (
                                <Link
                                    to={accountLink}
                                    onClick={() => setMobileOpen(false)}
                                    className="py-2 text-label-md text-primary font-semibold hover:underline"
                                >
                                    My Dashboard
                                </Link>
                            )}
                        </div>

                        <div className="pt-space-sm mt-space-xs border-t border-outline-variant flex items-center justify-between">
                            <span className="text-label-md text-on-surface-variant">Appearance</span>
                            <ThemeToggle />
                        </div>
                    </div>
                </nav>
            )}
        </header>
    );
}