import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import Icon from '../../../components/ui/Icon';
import Button from '../../../components/ui/Button';
import VendorStatCard from '../components/VendorStatCard';
import SalesSparkline from '../components/SalesSparkline';

import {
    dashboardStats,
    salesSeries,
    recentOrders,
    lowStockProducts,
    topProducts,
    money,
    compactMoney,
    ORDER_STATUS_STYLES,
} from '../data/dashboardMock';

/* ── Small sub-components (kept local — only used here) ───── */

function SectionHeader({ title, hint, action }) {
    return (
        <div className="flex items-end justify-between gap-space-md mb-space-md">
            <div>
                <h2 className="text-headline-sm text-on-surface font-bold tracking-tight">
                    {title}
                </h2>
                {hint && (
                    <p className="text-body-sm text-on-surface-variant mt-0.5">{hint}</p>
                )}
            </div>
            {action}
        </div>
    );
}

function StatusPill({ status }) {
    const cls = ORDER_STATUS_STYLES[status] ?? ORDER_STATUS_STYLES.processing;
    return (
        <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-label-sm font-bold capitalize ${cls}`}
        >
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
            {status}
        </span>
    );
}

/* ── Page ─────────────────────────────────────────────────── */

export default function VendorDashboardPage() {
    const user = useSelector((s) => s.auth.user);
    const vendor = user?.vendor;
    const businessName = vendor?.businessName || 'Your Store';
    const status = vendor?.status || 'pending';
    const stripeReady = vendor?.stripeOnboardingComplete;

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
    });

    return (
        <div className="flex flex-col gap-space-lg">
            {/* ── Welcome header ─────────────────────────── */}
            <div className="flex flex-wrap items-end justify-between gap-space-md">
                <div>
                    <p className="text-label-sm uppercase tracking-widest text-on-surface-variant font-bold">
                        Vendor Dashboard
                    </p>
                    <h1 className="text-headline-lg text-on-surface tracking-tight mt-1">
                        Welcome back, {businessName}
                    </h1>
                    <p className="text-body-md text-on-surface-variant mt-1">
                        {today} · Here's how your store is performing.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-space-sm">
                    <Button variant="secondary" size="md">
                        <Icon name="file_download" size={18} />
                        Export
                    </Button>
                    <Button to="/vendor/products/new" size="md">
                        <Icon name="add" size={18} />
                        Add Product
                    </Button>
                </div>
            </div>

            {/* ── Onboarding nudge ──────────────────────── */}
            {(!stripeReady || status !== 'approved') && (
                <div className="rounded-xl bg-tertiary-fixed/60 border border-tertiary-fixed-dim/60 p-space-md flex flex-wrap items-center justify-between gap-space-md">
                    <div className="flex items-center gap-space-md min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-tertiary-fixed-dim/70 flex items-center justify-center text-on-tertiary-fixed shrink-0">
                            <Icon name="pending_actions" size={20} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-label-lg font-bold text-on-tertiary-fixed">
                                {!stripeReady
                                    ? 'Finish your Stripe setup'
                                    : 'Application under review'}
                            </p>
                            <p className="text-body-sm text-on-tertiary-fixed/80">
                                {!stripeReady
                                    ? 'Complete identity verification to unlock payouts and go live.'
                                    : 'Our team is reviewing your store. You can keep preparing your catalog.'}
                            </p>
                        </div>
                    </div>
                    {!stripeReady && (
                        <Link
                            to="/sell/onboarding"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-tertiary-container text-on-tertiary px-4 py-2 text-label-md font-bold hover:bg-tertiary transition-colors"
                        >
                            Continue
                            <Icon name="arrow_forward" size={16} />
                        </Link>
                    )}
                </div>
            )}

            {/* ── KPI grid ──────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
                <VendorStatCard
                    icon="payments"
                    label="Revenue · 30d"
                    value={money(dashboardStats.revenue30d)}
                    change={dashboardStats.revenueChange}
                    hint={`${compactMoney(dashboardStats.revenue30d / 30)} avg / day`}
                    tone="primary"
                />
                <VendorStatCard
                    icon="receipt_long"
                    label="Orders · 30d"
                    value={String(dashboardStats.orders30d)}
                    change={dashboardStats.ordersChange}
                    hint={`${recentOrders.filter((o) => o.status === 'processing').length} need action`}
                    tone="secondary"
                />
                <VendorStatCard
                    icon="inventory_2"
                    label="Active products"
                    value={String(dashboardStats.activeProducts)}
                    hint={`${dashboardStats.lowStockCount} low on stock`}
                    tone="tertiary"
                />
                <VendorStatCard
                    icon="star"
                    label="Avg. rating"
                    value={dashboardStats.avgRating.toFixed(1)}
                    hint={`From ${dashboardStats.reviewCount} reviews`}
                    tone="surface"
                />
            </div>

            {/* ── Sales + Low stock ────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-md">
                {/* Sales chart */}
                <div className="lg:col-span-2 rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
                    <SectionHeader
                        title="Sales · last 7 days"
                        hint="Total revenue per day across all your products."
                        action={
                            <span className="inline-flex items-center gap-1 text-label-sm text-primary-container font-bold">
                                <Icon name="arrow_upward" size={14} />
                                {dashboardStats.revenueChange.toFixed(1)}% vs prev week
                            </span>
                        }
                    />
                    <SalesSparkline
                        values={salesSeries.values}
                        labels={salesSeries.labels}
                    />
                </div>

                {/* Low stock */}
                <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col">
                    <SectionHeader
                        title="Low stock"
                        hint="Restock soon to avoid going out of stock."
                        action={
                            <Link
                                to="/vendor/products"
                                className="text-label-md font-bold text-primary-container hover:underline inline-flex items-center gap-1"
                            >
                                Manage
                                <Icon name="arrow_forward" size={14} />
                            </Link>
                        }
                    />

                    {lowStockProducts.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-space-lg">
                            <Icon name="check_circle" size={32} className="text-primary-container" />
                            <p className="text-body-md text-on-surface-variant mt-2">
                                All products are well stocked.
                            </p>
                        </div>
                    ) : (
                        <ul className="flex flex-col gap-space-sm">
                            {lowStockProducts.map((p) => {
                                const pct = Math.min(
                                    100,
                                    Math.round((p.remaining / p.threshold) * 100)
                                );
                                const urgent = p.remaining <= p.threshold * 0.4;
                                return (
                                    <li
                                        key={p.id}
                                        className="flex items-center gap-space-sm p-2.5 rounded-lg bg-surface-container-low"
                                    >
                                        <div className="w-9 h-9 rounded-md bg-surface-container-high text-on-surface-variant font-bold text-[12px] flex items-center justify-center shrink-0">
                                            {p.initials}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-label-md text-on-surface font-semibold truncate">
                                                {p.title}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="flex-1 h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${
                                                            urgent ? 'bg-secondary' : 'bg-tertiary-fixed-dim'
                                                        }`}
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                                <span
                                                    className={`text-label-sm font-bold tabular-nums ${
                                                        urgent ? 'text-secondary' : 'text-on-surface-variant'
                                                    }`}
                                                >
                                                    {p.remaining} left
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>

            {/* ── Recent orders + Top products ─────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-md">
                {/* Recent orders */}
                <div className="lg:col-span-2 rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden">
                    <div className="p-space-lg pb-space-md">
                        <SectionHeader
                            title="Recent orders"
                            hint="Your latest incoming orders."
                            action={
                                <Link
                                    to="/vendor/orders"
                                    className="text-label-md font-bold text-primary-container hover:underline inline-flex items-center gap-1"
                                >
                                    View all
                                    <Icon name="arrow_forward" size={14} />
                                </Link>
                            }
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-surface-container-low">
                                <tr className="text-label-sm uppercase tracking-wider text-on-surface-variant">
                                    <th className="px-space-lg py-space-sm font-bold">Order</th>
                                    <th className="px-space-md  py-space-sm font-bold">Customer</th>
                                    <th className="px-space-md  py-space-sm font-bold text-center">Items</th>
                                    <th className="px-space-md  py-space-sm font-bold text-right">Total</th>
                                    <th className="px-space-md  py-space-sm font-bold">Status</th>
                                    <th className="px-space-lg py-space-sm font-bold text-right">Placed</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((o) => (
                                    <tr
                                        key={o.id}
                                        className="border-t border-outline-variant/50 hover:bg-surface-container-low/60 transition-colors"
                                    >
                                        <td className="px-space-lg py-space-sm">
                                            <Link
                                                to={`/vendor/orders/${o.id}`}
                                                className="font-mono text-body-sm text-primary-container hover:underline"
                                            >
                                                #{o.id}
                                            </Link>
                                        </td>
                                        <td className="px-space-md py-space-sm text-body-md text-on-surface">
                                            {o.customer}
                                        </td>
                                        <td className="px-space-md py-space-sm text-body-md text-on-surface-variant text-center tabular-nums">
                                            {o.items}
                                        </td>
                                        <td className="px-space-md py-space-sm text-body-md text-on-surface font-bold tabular-nums text-right">
                                            {money(o.total)}
                                        </td>
                                        <td className="px-space-md py-space-sm">
                                            <StatusPill status={o.status} />
                                        </td>
                                        <td className="px-space-lg py-space-sm text-body-sm text-on-surface-variant text-right whitespace-nowrap">
                                            {o.placedAt}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top products */}
                <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col">
                    <SectionHeader
                        title="Top products"
                        hint="Best sellers this month."
                    />

                    <ol className="flex flex-col gap-space-sm">
                        {topProducts.map((p, idx) => (
                            <li
                                key={p.id}
                                className="flex items-center gap-space-sm p-2.5 rounded-lg hover:bg-surface-container-low transition-colors"
                            >
                                <span
                                    className={`w-7 h-7 rounded-md flex items-center justify-center text-label-sm font-bold shrink-0 ${
                                        idx === 0
                                            ? 'bg-primary-container text-on-primary'
                                            : 'bg-surface-container-high text-on-surface-variant'
                                    }`}
                                >
                                    {idx + 1}
                                </span>
                                <div className="w-9 h-9 rounded-md bg-surface-container text-on-surface-variant font-bold text-[12px] flex items-center justify-center shrink-0">
                                    {p.initials}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-label-md text-on-surface font-semibold truncate">
                                        {p.title}
                                    </p>
                                    <p className="text-body-sm text-on-surface-variant">
                                        {p.unitsSold} sold
                                    </p>
                                </div>
                                <span className="text-label-md text-on-surface font-bold tabular-nums">
                                    {money(p.revenue)}
                                </span>
                            </li>
                        ))}
                    </ol>

                    <div className="mt-auto pt-space-md">
                        <Link
                            to="/vendor/reports"
                            className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-surface-container-low text-on-surface px-4 py-2.5 text-label-md font-bold hover:bg-surface-container transition-colors"
                        >
                            <Icon name="bar_chart" size={16} />
                            Open full reports
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}