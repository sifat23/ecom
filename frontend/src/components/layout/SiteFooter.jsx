import { Link } from 'react-router-dom';
import Icon from '../ui/Icon';
import { footerColumns, paymentBadges } from '../../data/homeContent';

const SOCIALS = [
    { icon: 'share',    label: 'Share' },
    { icon: 'camera',   label: 'Instagram' },
    { icon: 'forum',    label: 'Forum' },
    { icon: 'push_pin', label: 'Pinterest' },
];

export default function SiteFooter() {
    return (
        <footer className="w-full bg-surface-container-low text-on-surface">
            <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin pt-space-xl pb-space-lg">
                {/* ── Top grid ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-space-lg pb-space-xl">
                    {/* Brand column */}
                    <div className="lg:col-span-2 flex flex-col gap-space-md">
                        <div className="flex items-center gap-space-sm">
                            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-on-primary">
                                <Icon name="shopping_bag" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-headline-sm font-bold tracking-tight">Marketplace</span>
                                <span className="text-label-sm text-on-surface-variant">Multi-Vendor Store</span>
                            </div>
                        </div>

                        <p className="text-body-md text-on-surface-variant max-w-sm">
                            Discover timeless products from trusted vendors — curated for quality,
                            priced fairly, and delivered fast.
                        </p>

                        <div className="flex items-center gap-space-sm pt-space-xs">
                            {SOCIALS.map((s) => (
                                <a
                                    key={s.label}
                                    aria-label={s.label}
                                    href="#"
                                    className="w-9 h-9 rounded-full bg-surface-container-lowest flex items-center justify-center text-on-surface-variant hover:text-on-primary hover:bg-primary transition-colors shadow-sm"
                                >
                                    <Icon name={s.icon} size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {footerColumns.map((col) => (
                        <div key={col.heading} className="flex flex-col gap-space-sm">
                            <h3 className="text-label-lg font-bold uppercase tracking-wide">
                                {col.heading}
                            </h3>
                            <ul className="flex flex-col gap-space-xs">
                                {col.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            to={link.to}
                                            className="text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* ── Payment strip ── */}
                <div className="flex flex-wrap items-center justify-between gap-space-md py-space-md bg-surface-container-high/40 rounded-xl px-space-md mb-space-lg">
                    <div className="flex items-center gap-space-sm">
                        <Icon name="lock" size={18} className="text-on-surface-variant" />
                        <span className="text-label-sm text-on-surface-variant uppercase">
              Guaranteed Secure Checkout
            </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-space-xs">
                        {paymentBadges.map((badge) => (
                            <span
                                key={badge}
                                className="px-2.5 py-1 bg-surface-container-lowest rounded-md text-[11px] font-bold tracking-wider text-on-surface shadow-sm"
                            >
                {badge}
              </span>
                        ))}
                    </div>
                </div>

                {/* ── Bottom row ── */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-space-sm pt-space-sm text-on-surface-variant">
                    <p className="text-body-sm">
                        © {new Date().getFullYear()} Marketplace. All rights reserved.
                    </p>
                    <div className="flex items-center gap-space-xs text-label-sm">
                        <Icon name="language" size={16} />
                        <span>United States | USD $</span>
                        <Icon name="arrow_drop_down" size={14} />
                    </div>
                </div>
            </div>
        </footer>
    );
}