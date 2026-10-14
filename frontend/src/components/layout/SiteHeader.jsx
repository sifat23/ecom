import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Icon from '../ui/Icon';
import ThemeToggle from '../ui/ThemeToggle';

const NAV = [
    { label: 'Home',          to: '/' },
    { label: 'Shop',          to: '/search',          hasDropdown: true },
    { label: 'Collections',   to: '/search?tag=new' },
    { label: 'Best Sellers',  to: '/search?sort=best' },
    { label: 'New Arrivals',  to: '/search?sort=new' },
    { label: 'Pages',         to: '/about' },
];

export default function SiteHeader() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="w-full bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
            <div className="h-20 max-w-7xl mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin flex items-center justify-between gap-space-md">
                {/* ── Logo ── */}
                <Link to="/" className="flex items-center gap-space-sm group">
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

                {/* ── Desktop nav ── */}
                <nav className="hidden xl:flex items-center gap-space-lg">
                    {NAV.map((item) => (
                        <NavLink
                            key={item.label}
                            to={item.to}
                            end={item.to === '/'}
                            className={({ isActive }) =>
                                `py-1 transition-colors text-label-lg ${
                                    isActive
                                        ? "text-primary font-bold after:content-[''] after:block after:w-full after:h-0.5 after:bg-primary after:mt-1 after:rounded-full"
                                        : 'text-on-surface-variant hover:text-on-surface'
                                }`
                            }
                        >
              <span className="inline-flex items-center gap-1">
                {item.label}
                  {item.hasDropdown && <Icon name="expand_more" size={16} />}
              </span>
                        </NavLink>
                    ))}
                </nav>

                {/* ── Actions ── */}
                <div className="flex items-center gap-space-sm md:gap-space-md">
                    <button
                        type="button"
                        aria-label="Search store"
                        className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
                    >
                        <Icon name="search" />
                    </button>

                    <div className="hidden sm:block">
                        <ThemeToggle />
                    </div>

                    <Link
                        to="/account"
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
                        <span className="absolute top-1.5 right-1.5 w-[18px] h-[18px] rounded-full bg-secondary text-on-secondary text-label-sm text-[10px] leading-none flex items-center justify-center font-bold shadow-sm">
              2
            </span>
                    </Link>

                    {/* Mobile hamburger */}
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

            {/* ── Mobile drawer ── */}
            {mobileOpen && (
                <nav className="xl:hidden border-t border-outline-variant bg-surface-container-lowest">
                    <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-tablet py-space-md flex flex-col">
                        {NAV.map((item) => (
                            <NavLink
                                key={item.label}
                                to={item.to}
                                end={item.to === '/'}
                                onClick={() => setMobileOpen(false)}
                                className={({ isActive }) =>
                                    `py-3 border-b border-outline-variant last:border-0 text-label-lg ${
                                        isActive ? 'text-primary font-bold' : 'text-on-surface-variant'
                                    }`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                        <div className="pt-space-md flex items-center gap-space-sm">
                            <ThemeToggle />
                            <span className="text-label-md text-on-surface-variant">Theme</span>
                        </div>
                    </div>
                </nav>
            )}
        </header>
    );
}