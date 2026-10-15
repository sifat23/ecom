import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Icon from '../../components/ui/Icon';

/* ── helpers ──────────────────────────────────────────── */

function formatUtc(d) {
    const hh = String(d.getUTCHours()).padStart(2, '0');
    const mm = String(d.getUTCMinutes()).padStart(2, '0');
    const ss = String(d.getUTCSeconds()).padStart(2, '0');
    return `${hh}:${mm}:${ss} UTC`;
}

function getInitials(user) {
    if (!user) return '--';
    const f = user.firstName?.[0] ?? '';
    const l = user.lastName?.[0] ?? '';
    return (f + l).toUpperCase() || 'U';
}

/* ── page ─────────────────────────────────────────────── */

export default function ForbiddenPage() {
    const user = useSelector((s) => s.auth.user);
    const [utc, setUtc] = useState(() => formatUtc(new Date()));
    const switchPanelRef = useRef(null);

    useEffect(() => {
        const id = setInterval(() => setUtc(formatUtc(new Date())), 1000);
        return () => clearInterval(id);
    }, []);

    const onSwitchAccount = () => {
        const el = switchPanelRef.current;
        if (!el) return;
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ring-2', 'ring-primary');
        setTimeout(() => el.classList.remove('ring-2', 'ring-primary'), 1200);
    };

    const email = user?.email ?? 'guest@example.com';
    const initials = getInitials(user);

    return (
        <div className="flex flex-col w-full">
            <div className="relative w-full overflow-hidden bg-background">
                {/* Ambient blur blobs */}
                <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-primary-fixed/30 blur-3xl pointer-events-none" />
                <div className="absolute top-48 -right-32 w-[32rem] h-[32rem] rounded-full bg-surface-container-high/60 blur-3xl pointer-events-none" />

                <div className="max-w-[1280px] mx-auto px-margin-mobile sm:px-margin-tablet lg:px-margin pt-12 pb-20">
                    {/* Top status meta trail */}
                    <div className="flex items-center justify-between pb-8">
                        <div className="flex items-center gap-space-sm text-on-surface-variant">
                            <span className="inline-flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm uppercase tracking-wider">
                                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                Sec-Gate Enforcement
                            </span>
                            <span className="text-outline text-label-sm font-label-sm">/</span>
                            <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">
                                ENCLAVE_POL_403
                            </span>
                        </div>
                        <div className="hidden sm:flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant bg-surface-container-low px-space-sm py-1 rounded-md">
                            <Icon name="verified_user" size={15} className="text-primary" />
                            <span>Zero-Trust Protocol V4.8</span>
                        </div>
                    </div>

                    {/* Main asymmetric hero */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start relative">
                        {/* ── Left column ───────────────────────────── */}
                        <div className="lg:col-span-7 flex flex-col pt-2 relative z-10">
                            {/* Watermark numeral */}
                            <div className="relative mb-2">
                                <span className="font-display-hero text-[110px] sm:text-[140px] lg:text-[160px] leading-none font-bold text-surface-container-highest/75 select-none tracking-tighter block -ml-2 -mb-12 sm:-mb-16">
                                    403
                                </span>
                                <div className="relative z-10 inline-flex items-center gap-space-xs px-space-md py-1.5 rounded-full bg-surface-container-lowest shadow-sm text-secondary font-label-sm text-label-sm tracking-widest uppercase">
                                    <Icon name="lock" size={16} className="text-secondary" />
                                    <span>Security Policy • Access Restricted</span>
                                </div>
                            </div>

                            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight mt-3">
                                Protected Governance Boundary
                            </h1>
                            <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-md max-w-xl">
                                You have reached an enclave reserved exclusively for verified store
                                administrators and authenticated artisan guild members. Your current
                                credentials do not have elevated platform governance privileges.
                            </p>

                            {/* Identity card */}
                            <div className="mt-space-lg p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
                                <div className="flex items-center gap-space-md">
                                    <div className="w-11 h-11 rounded-lg bg-surface-container-high flex items-center justify-center text-primary-container font-headline-sm">
                                        {initials}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                                            Active Session Identity
                                        </span>
                                        <span className="font-headline-sm text-headline-sm text-on-surface truncate">
                                            {email}
                                        </span>
                                        <span className="font-body-sm text-body-sm text-outline flex items-center gap-1 mt-0.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-outline" />
                                            Shopper / Standard Account (Level 0)
                                        </span>
                                    </div>
                                </div>
                                <div className="self-start sm:self-auto">
                                    <span className="inline-flex items-center gap-1 px-space-sm py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-mono">
                                        Scope: public_read
                                    </span>
                                </div>
                            </div>

                            {/* CTAs */}
                            <div className="flex flex-wrap items-center gap-space-md mt-space-xl">
                                <Link
                                    to="/"
                                    className="inline-flex items-center justify-center gap-space-sm px-6 py-3.5 rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg shadow-sm hover:bg-primary transition-colors"
                                >
                                    <span>Return to Storefront</span>
                                    <Icon name="arrow_forward" size={18} />
                                </Link>
                                <button
                                    type="button"
                                    onClick={onSwitchAccount}
                                    className="inline-flex items-center justify-center gap-space-sm px-5 py-3.5 rounded-lg bg-surface-container-lowest text-on-surface font-label-lg text-label-lg shadow-sm hover:bg-surface-container-high transition-colors"
                                >
                                    <Icon name="swap_horiz" size={18} className="text-primary" />
                                    <span>Switch Account</span>
                                </button>
                                <Link
                                    to="/contact"
                                    className="inline-flex items-center gap-1 font-label-lg text-label-lg text-primary hover:underline ml-1"
                                >
                                    <span>Contact Security Concierge</span>
                                    <Icon name="open_in_new" size={16} />
                                </Link>
                            </div>

                            {/* Telemetry ledger */}
                            <div className="mt-space-xl p-space-md rounded-xl bg-surface-container-low">
                                <div className="flex items-center justify-between pb-space-xs mb-space-xs">
                                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest font-semibold flex items-center gap-1.5">
                                        <Icon name="tune" size={14} className="text-outline" />
                                        Security Incident Telemetry
                                    </span>
                                    <span className="font-label-sm text-label-sm text-primary font-mono flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                        ACTIVE MONITOR
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-md font-mono text-body-sm text-on-surface mt-2">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">
                                            Client IP
                                        </span>
                                        <span className="font-medium mt-0.5 text-on-surface">
                                            194.230.12.84
                                        </span>
                                        <span className="text-[10px] text-outline">Copenhagen, DK</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">
                                            Incident Ref
                                        </span>
                                        <span className="font-medium mt-0.5 text-secondary">
                                            SEC-403-9821A
                                        </span>
                                        <span className="text-[10px] text-outline">Cluster-Nord-04</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">
                                            Required Scope
                                        </span>
                                        <span className="font-medium mt-0.5 text-on-surface truncate">
                                            admin:platform
                                        </span>
                                        <span className="text-[10px] text-outline">Role Tier IV</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">
                                            Recorded UTC
                                        </span>
                                        <span className="font-medium mt-0.5 text-on-surface">
                                            {utc}
                                        </span>
                                        <span className="text-[10px] text-outline">Synced GPS-PTP</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Right column ──────────────────────────── */}
                        <div className="lg:col-span-5 flex flex-col gap-space-lg lg:mt-6">
                            {/* Access topology */}
                            <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-md flex flex-col relative overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary via-tertiary-fixed-dim to-primary" />
                                <div className="flex items-center justify-between">
                                    <span className="font-headline-sm text-headline-sm text-on-surface">
                                        Access Topology
                                    </span>
                                    <span className="px-space-xs py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-label-sm">
                                        Denied at L3
                                    </span>
                                </div>
                                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                                    Permission tier requirement vs current evaluated grant on{' '}
                                    <code className="font-mono text-primary text-[11px]">
                                        /admin/artisan-settlement
                                    </code>
                                    .
                                </p>

                                {/* Radial gauge */}
                                <div className="my-space-md py-space-sm flex flex-col items-center justify-center bg-surface-container-low rounded-lg p-space-md">
                                    <svg
                                        aria-label="Permission Level Radial Graph"
                                        className="w-full max-w-[260px] text-primary"
                                        viewBox="0 0 280 130"
                                    >
                                        <path
                                            className="text-surface-container-highest"
                                            d="M 30 110 A 110 110 0 0 1 250 110"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeWidth="12"
                                        />
                                        <path
                                            className="text-primary-container"
                                            d="M 30 110 A 110 110 0 0 1 92 42"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeWidth="12"
                                        />
                                        <circle className="fill-secondary" cx="218" cy="62" r="7" />
                                        <circle
                                            className="fill-secondary/20 animate-ping"
                                            cx="218"
                                            cy="62"
                                            r="14"
                                        />
                                        <text
                                            className="fill-on-surface font-sans font-bold text-[28px]"
                                            textAnchor="middle"
                                            x="140"
                                            y="85"
                                        >
                                            Tier 1
                                        </text>
                                        <text
                                            className="fill-on-surface-variant font-sans text-[11px] tracking-widest uppercase"
                                            textAnchor="middle"
                                            x="140"
                                            y="105"
                                        >
                                            Target Tier: 4
                                        </text>
                                    </svg>

                                    {/* Role breakdown */}
                                    <div className="w-full space-y-2 mt-2">
                                        <div className="flex items-center justify-between text-body-sm">
                                            <span className="text-on-surface flex items-center gap-1.5">
                                                <Icon
                                                    name="check_circle"
                                                    size={16}
                                                    className="text-primary"
                                                />
                                                Shopper / Patron
                                            </span>
                                            <span className="font-label-sm text-label-sm text-primary font-mono">
                                                GRANTED
                                            </span>
                                        </div>
                                        <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                                            <div className="w-full h-full bg-primary-container" />
                                        </div>

                                        <div className="flex items-center justify-between text-body-sm pt-1">
                                            <span className="text-on-surface flex items-center gap-1.5">
                                                <Icon
                                                    name="radio_button_unchecked"
                                                    size={16}
                                                    className="text-outline"
                                                />
                                                Artisan Guild Backoffice
                                            </span>
                                            <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">
                                                UNVERIFIED
                                            </span>
                                        </div>
                                        <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                                            <div className="w-0 h-full bg-primary" />
                                        </div>

                                        <div className="flex items-center justify-between text-body-sm pt-1">
                                            <span className="text-on-surface flex items-center gap-1.5">
                                                <Icon
                                                    name="cancel"
                                                    size={16}
                                                    className="text-secondary"
                                                />
                                                Platform Financial Escrow
                                            </span>
                                            <span className="font-label-sm text-label-sm text-secondary font-mono">
                                                RESTRICTED
                                            </span>
                                        </div>
                                        <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                                            <div className="w-0 h-full bg-secondary" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick account switcher */}
                            <div
                                ref={switchPanelRef}
                                className="p-space-sm rounded-lg bg-surface-container flex flex-col gap-2 transition-all"
                            >
                                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">
                                    Switch Account Context
                                </span>
                                <Link
                                    to="/login"
                                    className="flex items-center justify-between p-2 rounded-md bg-surface-container-lowest cursor-pointer hover:bg-surface-variant transition-colors group"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="w-7 h-7 rounded bg-primary-container text-on-primary flex items-center justify-center text-[12px] font-bold">
                                            MK
                                        </span>
                                        <div className="flex flex-col">
                                            <span className="font-label-sm text-label-sm text-on-surface group-hover:text-primary">
                                                M. Klint (Nordic Atelier)
                                            </span>
                                            <span className="text-[10px] text-outline">
                                                Verified Artisan Vendor
                                            </span>
                                        </div>
                                    </div>
                                    <Icon
                                        name="login"
                                        size={16}
                                        className="text-outline group-hover:text-primary"
                                    />
                                </Link>
                                <Link
                                    to="/admin/login"
                                    className="flex items-center justify-between p-2 rounded-md bg-surface-container-lowest cursor-pointer hover:bg-surface-variant transition-colors group"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="w-7 h-7 rounded bg-surface-container-highest text-on-surface flex items-center justify-center text-[12px] font-bold">
                                            SA
                                        </span>
                                        <div className="flex flex-col">
                                            <span className="font-label-sm text-label-sm text-on-surface group-hover:text-primary">
                                                SysAdmin (Ops-Enclave)
                                            </span>
                                            <span className="text-[10px] text-outline">
                                                Regional Platform Governance
                                            </span>
                                        </div>
                                    </div>
                                    <Icon
                                        name="login"
                                        size={16}
                                        className="text-outline group-hover:text-primary"
                                    />
                                </Link>
                            </div>

                            {/* Why-am-I-seeing-this */}
                            <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex items-start gap-space-sm">
                                <Icon
                                    name="shield"
                                    size={20}
                                    className="text-primary-container mt-0.5"
                                />
                                <div className="flex flex-col">
                                    <span className="font-headline-sm text-headline-sm text-on-surface">
                                        Why am I seeing this?
                                    </span>
                                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                                        Minimog isolates customer profiles from operational artisan
                                        settlement vaults. If you manage an artisan workshop,
                                        authenticate via your registered partner passkey or submit an
                                        escrow onboarding request.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-outline-variant/30 my-16" />

                    {/* Suggested waypoints */}
                    <div className="flex flex-col gap-space-md">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                            <div>
                                <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-bold">
                                    Permitted Destinations
                                </span>
                                <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight mt-1">
                                    Suggested Helpful Waypoints
                                </h2>
                            </div>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">
                                Your current account holds active sessions for the following portals:
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg mt-2">
                            {/* Waypoint 1 — Customer */}
                            <Link
                                to="/account"
                                className="group p-space-lg rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                            >
                                <div>
                                    <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary-container group-hover:text-on-primary transition-colors mb-space-md">
                                        <Icon name="shopping_bag" size={20} />
                                    </div>
                                    <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">
                                        Active Entitlement
                                    </span>
                                    <h3 className="font-headline-sm text-headline-sm text-on-surface mt-1 group-hover:text-primary transition-colors">
                                        Customer Dashboard
                                    </h3>
                                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                                        Browse artisanal curated collections, view order shipments,
                                        manage home deliveries, and access downloadable tax receipts.
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 font-label-md text-label-md text-primary mt-space-lg">
                                    <span>View Your Purchases</span>
                                    <Icon
                                        name="arrow_forward"
                                        size={16}
                                        className="group-hover:translate-x-1 transition-transform"
                                    />
                                </div>
                            </Link>

                            {/* Waypoint 2 — Vendor onboarding */}
                            <Link
                                to="/sell"
                                className="group p-space-lg rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                            >
                                <div>
                                    <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary-container group-hover:text-on-primary transition-colors mb-space-md">
                                        <Icon name="storefront" size={20} />
                                    </div>
                                    <span className="font-label-sm text-label-sm text-on-surface-variant font-bold uppercase tracking-wider">
                                        Partner Guild
                                    </span>
                                    <h3 className="font-headline-sm text-headline-sm text-on-surface mt-1 group-hover:text-primary transition-colors">
                                        Artisan Workshop Enrollment
                                    </h3>
                                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                                        Apply for craft certification, submit workshop credentials,
                                        and request cryptographic settlement access for Nordic guild
                                        backoffices.
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 font-label-md text-label-md text-primary mt-space-lg">
                                    <span>Begin Application</span>
                                    <Icon
                                        name="arrow_forward"
                                        size={16}
                                        className="group-hover:translate-x-1 transition-transform"
                                    />
                                </div>
                            </Link>

                            {/* Waypoint 3 — Support */}
                            <Link
                                to="/contact"
                                className="group p-space-lg rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                            >
                                <div>
                                    <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary-container group-hover:text-on-primary transition-colors mb-space-md">
                                        <Icon name="support_agent" size={20} />
                                    </div>
                                    <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">
                                        24/7 Security Escrow
                                    </span>
                                    <h3 className="font-headline-sm text-headline-sm text-on-surface mt-1 group-hover:text-primary transition-colors">
                                        Concierge Desk
                                    </h3>
                                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                                        Experiencing a permission discrepancy? Open an escalated
                                        ticket citing{' '}
                                        <code className="font-mono text-[11px] text-secondary">
                                            SEC-403-9821A
                                        </code>{' '}
                                        for expedited clearance.
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 font-label-md text-label-md text-primary mt-space-lg">
                                    <span>Open Security Ticket</span>
                                    <Icon
                                        name="arrow_forward"
                                        size={16}
                                        className="group-hover:translate-x-1 transition-transform"
                                    />
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}