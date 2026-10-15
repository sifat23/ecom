import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Icon from '../../../components/ui/Icon';
import { useGetMyVendorQuery } from '../vendorApi';
import { useLogoutMutation } from '../../../store/api/authApi';

/* ── Data ───────────────────────────────────────────────── */

const REVIEW_STEPS = [
    { key: 'account',   label: 'Account created',       icon: 'person_add',    state: 'done'   },
    { key: 'submitted', label: 'Application submitted', icon: 'task_alt',      state: 'done'   },
    { key: 'review',    label: 'Under review',          icon: 'hourglass_top', state: 'active' },
    { key: 'approved',  label: 'Dashboard unlocked',    icon: 'rocket_launch', state: 'todo'   },
];

const CHECKLIST = [
    {
        icon: 'credit_card',
        title: 'Finish Stripe setup',
        body:  "Complete identity verification so payouts can flow the moment you're approved.",
        to:    '/sell/onboarding',
        cta:   'Continue onboarding',
    },
    {
        icon: 'inventory_2',
        title: 'Prepare your catalog',
        body:  'Line up titles, descriptions, photos, prices, and stock counts for your first listings.',
    },
    {
        icon: 'local_shipping',
        title: 'Plan your fulfillment',
        body:  "Decide whether you'll self-ship with your own carrier or generate labels through the platform.",
    },
];

const SUPPORT_EMAIL = 'vendors@marketplace.local';

/* ── Sub-components ─────────────────────────────────────── */

function StepDot({ state, icon }) {
    const base =
        'w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors';
    if (state === 'done')
        return (
            <span className={`${base} bg-primary-container text-on-primary`}>
                <Icon name="check" size={20} />
            </span>
        );
    if (state === 'active')
        return (
            <span className={`${base} bg-tertiary-fixed text-on-tertiary-fixed relative`}>
                <Icon name={icon} size={20} />
                <span className="absolute inset-0 rounded-full bg-tertiary-fixed-dim/50 animate-ping" />
            </span>
        );
    return (
        <span className={`${base} bg-surface-container text-on-surface-variant`}>
            <Icon name={icon} size={20} />
        </span>
    );
}

function ReviewTimeline({ currentStepIndex = 2 }) {
    return (
        <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
            <ol className="flex flex-col md:flex-row md:items-start md:justify-between gap-space-md md:gap-space-sm relative">
                {REVIEW_STEPS.map((step, i) => {
                    const state =
                        i < currentStepIndex ? 'done' :
                        i === currentStepIndex ? 'active' :
                        'todo';

                    return (
                        <li
                            key={step.key}
                            className="flex md:flex-col md:items-center md:flex-1 items-center gap-space-md md:gap-2 relative md:text-center"
                        >
                            {i < REVIEW_STEPS.length - 1 && (
                                <span
                                    className={`hidden md:block absolute top-5 left-[calc(50%+20px)] right-[calc(-50%+20px)] h-0.5 rounded-full ${
                                        state === 'done'
                                            ? 'bg-primary-container'
                                            : 'bg-surface-container-highest'
                                    }`}
                                    aria-hidden="true"
                                />
                            )}

                            <StepDot state={state} icon={step.icon} />

                            <div className="flex flex-col md:items-center md:mt-2">
                                <span
                                    className={`text-label-md font-bold ${
                                        state === 'todo'
                                            ? 'text-on-surface-variant'
                                            : state === 'active'
                                                ? 'text-on-tertiary-fixed'
                                                : 'text-on-surface'
                                    }`}
                                >
                                    {step.label}
                                </span>
                                {state === 'active' && (
                                    <span className="text-label-sm text-on-surface-variant mt-0.5">
                                        In progress
                                    </span>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
}

/* ── Page ───────────────────────────────────────────────── */

export default function VendorPendingPage() {
    const navigate = useNavigate();
    const user = useSelector((s) => s.auth.user);

    const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

    const { data: vendor, isFetching, refetch } = useGetMyVendorQuery(undefined, {
        pollingInterval: 30_000,
        refetchOnMountOrArgChange: true,
    });

    const [lastChecked, setLastChecked] = useState(() => new Date());

    const businessName =
        vendor?.businessName ||
        user?.vendor?.businessName ||
        'Your store';

    const submittedAt = vendor?.createdAt
        ? new Date(vendor.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })
        : null;

    const stripeReady = vendor?.stripeOnboardingComplete;

    const onCheckNow = async () => {
        await refetch();
        setLastChecked(new Date());
    };

    const onLogout = async () => {
        try {
            await logout().unwrap();
        } catch {
            /* ignore — cookie clears either way */
        }
        navigate('/', { replace: true });
    };

    return (
        <div className="mx-auto max-w-[1120px] px-margin-mobile md:px-margin-tablet lg:px-margin py-space-xl flex flex-col gap-space-lg">

            {/* ── Utility bar: brand · home · sign out ─── */}
            <div className="flex items-center justify-between gap-space-md">
                <Link
                    to="/"
                    className="flex items-center gap-space-sm group"
                    aria-label="Go to Marketplace home"
                >
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm transition-transform group-hover:scale-105">
                        <Icon name="shopping_bag" size={22} />
                    </div>
                    <div className="flex flex-col leading-tight">
                        <span className="text-headline-sm text-on-surface font-bold tracking-tight">
                            Marketplace
                        </span>
                        <span className="text-label-sm text-on-surface-variant font-medium">
                            Vendor Application
                        </span>
                    </div>
                </Link>

                <div className="flex items-center gap-space-sm">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 rounded-lg bg-surface-container-lowest text-on-surface px-4 py-2.5 text-label-md font-semibold shadow-sm hover:bg-surface-container transition-colors"
                    >
                        <Icon name="home" size={18} />
                        <span className="hidden sm:inline">Go to Home</span>
                        <span className="sm:hidden">Home</span>
                    </Link>

                    <button
                        type="button"
                        onClick={onLogout}
                        disabled={isLoggingOut}
                        className="inline-flex items-center gap-2 rounded-lg bg-surface-container-lowest text-error px-4 py-2.5 text-label-md font-semibold shadow-sm hover:bg-error-container/40 transition-colors disabled:opacity-60"
                    >
                        <Icon name="logout" size={18} />
                        <span className="hidden sm:inline">
                            {isLoggingOut ? 'Signing out…' : 'Sign out'}
                        </span>
                        <span className="sm:hidden">Out</span>
                    </button>
                </div>
            </div>

            {/* ── Hero card ──────────────────────────────── */}
            <section className="relative overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm">
                <div className="absolute -top-24 -right-16 w-80 h-80 rounded-full bg-tertiary-fixed/40 blur-3xl pointer-events-none" />

                <div className="relative p-space-lg md:p-space-xl flex flex-col gap-space-lg">
                    <div className="flex flex-wrap items-center justify-between gap-space-sm">
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-tertiary-fixed/70 text-on-tertiary-fixed text-label-sm font-bold uppercase tracking-wider">
                            <span className="relative flex w-2 h-2">
                                <span className="absolute inset-0 rounded-full bg-on-tertiary-fixed/60 animate-ping" />
                                <span className="relative w-2 h-2 rounded-full bg-on-tertiary-fixed" />
                            </span>
                            Pending Review
                        </span>

                        {submittedAt && (
                            <span className="text-label-md text-on-surface-variant">
                                Submitted {submittedAt}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-space-sm max-w-2xl">
                        <h1 className="text-headline-lg md:text-display-hero-mobile text-on-surface tracking-tight">
                            Hang tight, {businessName} — your application is in the queue.
                        </h1>
                        <p className="text-body-lg text-on-surface-variant">
                            A platform admin is reviewing your store right now. This usually
                            takes <strong className="text-on-surface">1–2 business days</strong>.
                            You'll receive an email the moment a decision is made — no action
                            needed from you.
                        </p>
                    </div>

                    <ReviewTimeline currentStepIndex={2} />

                    <div className="flex flex-wrap items-center gap-space-sm">
                        <button
                            type="button"
                            onClick={onCheckNow}
                            disabled={isFetching}
                            className="inline-flex items-center gap-2 rounded-lg bg-primary-container text-on-primary px-5 py-3 text-label-lg font-semibold hover:bg-primary transition-colors disabled:opacity-60"
                        >
                            <Icon
                                name={isFetching ? 'progress_activity' : 'refresh'}
                                size={18}
                                className={isFetching ? 'animate-spin' : ''}
                            />
                            {isFetching ? 'Checking…' : 'Check status now'}
                        </button>

                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-2 rounded-lg bg-surface-container-low text-on-surface px-5 py-3 text-label-lg font-semibold hover:bg-surface-container transition-colors"
                        >
                            <Icon name="support_agent" size={18} />
                            Contact admin
                        </Link>

                        <span className="text-body-sm text-on-surface-variant ml-auto inline-flex items-center gap-1.5">
                            <Icon name="schedule" size={14} />
                            Auto-checks every 30s · last at{' '}
                            {lastChecked.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </span>
                    </div>
                </div>
            </section>

            {/* ── Two-column body ────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">

                <aside className="lg:col-span-1 rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col gap-space-md">
                    <div className="flex items-center gap-space-sm">
                        <div className="w-9 h-9 rounded-lg bg-primary-container/10 text-primary-container flex items-center justify-center">
                            <Icon name="receipt_long" size={18} />
                        </div>
                        <div>
                            <h2 className="text-headline-sm text-on-surface font-bold">
                                What we have on file
                            </h2>
                            <p className="text-body-sm text-on-surface-variant">
                                Your submitted business details.
                            </p>
                        </div>
                    </div>

                    <dl className="flex flex-col gap-space-sm">
                        <div className="flex items-start justify-between gap-space-md py-2 border-b border-outline-variant/50">
                            <dt className="text-label-md text-on-surface-variant">Business name</dt>
                            <dd className="text-label-md text-on-surface font-semibold text-right">
                                {vendor?.businessName || '—'}
                            </dd>
                        </div>
                        <div className="flex items-start justify-between gap-space-md py-2 border-b border-outline-variant/50">
                            <dt className="text-label-md text-on-surface-variant">Tax ID / EIN</dt>
                            <dd className="text-label-md text-on-surface font-semibold text-right font-mono">
                                {vendor?.taxId || '—'}
                            </dd>
                        </div>
                        <div className="flex items-start justify-between gap-space-md py-2 border-b border-outline-variant/50">
                            <dt className="text-label-md text-on-surface-variant">Stripe setup</dt>
                            <dd className="text-label-md font-semibold text-right">
                                {stripeReady ? (
                                    <span className="inline-flex items-center gap-1 text-primary-container">
                                        <Icon name="check_circle" size={14} />
                                        Complete
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 text-secondary">
                                        <Icon name="error" size={14} />
                                        Incomplete
                                    </span>
                                )}
                            </dd>
                        </div>
                        <div className="flex items-start justify-between gap-space-md py-2">
                            <dt className="text-label-md text-on-surface-variant">Status</dt>
                            <dd className="text-label-md font-semibold text-right">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary-fixed/70 text-on-tertiary-fixed text-label-sm font-bold uppercase tracking-wider">
                                    Pending
                                </span>
                            </dd>
                        </div>
                    </dl>

                    <Link
                        to="/sell/register"
                        className="text-label-md font-semibold text-primary-container hover:underline inline-flex items-center gap-1 self-start"
                    >
                        <Icon name="edit" size={14} />
                        Edit submitted details
                    </Link>
                </aside>

                <section className="lg:col-span-2 flex flex-col gap-space-md">
                    <div>
                        <h2 className="text-headline-sm text-on-surface font-bold tracking-tight">
                            While you wait
                        </h2>
                        <p className="text-body-md text-on-surface-variant mt-1">
                            Get a head start so you can hit the ground running once approved.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                        {CHECKLIST.map((item) => (
                            <div
                                key={item.title}
                                className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm flex flex-col gap-space-sm h-full"
                            >
                                <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary-container">
                                    <Icon name={item.icon} size={20} />
                                </div>
                                <h3 className="text-label-lg text-on-surface font-bold">
                                    {item.title}
                                </h3>
                                <p className="text-body-sm text-on-surface-variant leading-relaxed flex-1">
                                    {item.body}
                                </p>
                                {item.to && (
                                    <Link
                                        to={item.to}
                                        className="mt-auto inline-flex items-center gap-1 text-label-md font-bold text-primary-container hover:underline"
                                    >
                                        {item.cta}
                                        <Icon name="arrow_forward" size={14} />
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* ── Support strip ──────────────────────────── */}
            <section className="rounded-xl bg-primary-container text-on-primary p-space-lg flex flex-wrap items-center justify-between gap-space-md">
                <div className="flex items-start gap-space-md">
                    <div className="w-11 h-11 rounded-lg bg-on-primary/10 flex items-center justify-center shrink-0">
                        <Icon name="help_center" size={22} />
                    </div>
                    <div>
                        <h3 className="text-headline-sm font-bold">
                            Waiting longer than expected?
                        </h3>
                        <p className="text-body-md text-on-primary-container mt-0.5 max-w-2xl">
                            Reviews usually finish in 1–2 business days. If it's been longer,
                            email us at{' '}
                            <a
                                href={`mailto:${SUPPORT_EMAIL}?subject=Vendor%20application%20follow-up`}
                                className="underline font-semibold text-primary-fixed hover:text-primary-fixed-dim"
                            >
                                {SUPPORT_EMAIL}
                            </a>{' '}
                            with your business name and we'll nudge the review queue.
                        </p>
                    </div>
                </div>

                <a
                    href={`mailto:${SUPPORT_EMAIL}?subject=Vendor%20application%20follow-up`}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary-fixed text-on-primary-fixed px-5 py-3 text-label-lg font-bold hover:bg-primary-fixed-dim transition-colors shrink-0"
                >
                    <Icon name="mail" size={18} />
                    Email admin
                </a>
            </section>
        </div>
    );
}