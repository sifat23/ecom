import { Link } from 'react-router-dom';

export default function AdminSubpage({
    title,
    subtitle,
    badge = 'Console Module',
    icon = 'dashboard',
    stats = [],
    actionButtonText,
    onAction,
}) {
    return (
        <main className="relative pt-24 sm:pt-28 pb-16 bg-surface flex-1 w-full px-space-lg">
            <div className="flex flex-col w-full gap-space-lg">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
                    <div className="flex flex-col gap-space-xs max-w-2xl">
                        <div className="inline-flex items-center gap-space-xs text-primary font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                            <span className="w-2 h-2 rounded-full bg-primary-container animate-ping"></span>
                            <span>Atelier Governance · {badge}</span>
                        </div>
                        <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight flex items-center gap-2">
                            <span className="material-symbols-outlined text-[32px] text-primary">{icon}</span>
                            <span>{title}</span>
                        </h1>
                        <p className="font-body-md text-body-md text-on-surface-variant">
                            {subtitle}
                        </p>
                    </div>

                    <div className="flex items-center gap-space-sm">
                        <Link
                            to="/admin/dashboard"
                            className="flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-md text-label-md shadow-sm transition-all"
                        >
                            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                            <span>Back to Executive Overview</span>
                        </Link>
                        {actionButtonText && (
                            <button
                                type="button"
                                onClick={onAction}
                                className="flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md shadow-sm transition-all cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[18px]">add</span>
                                <span>{actionButtonText}</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Stat Cards */}
                {stats.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
                        {stats.map((s, idx) => (
                            <div
                                key={idx}
                                className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                                        {s.label}
                                    </span>
                                    <span className="p-1.5 rounded-lg bg-surface-container-low text-primary flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[18px]">{s.icon || icon}</span>
                                    </span>
                                </div>
                                <div className="mt-space-sm">
                                    <span className="font-display-hero-mobile text-display-hero-mobile text-on-surface font-bold tracking-tight">
                                        {s.value}
                                    </span>
                                </div>
                                {s.trend && (
                                    <div className="mt-space-sm pt-space-xs border-t border-surface-container text-xs text-primary font-semibold flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[16px]">trending_up</span>
                                        <span>{s.trend}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Subpage Panel Content */}
                <div className="p-space-xl rounded-xl bg-surface-container-lowest shadow-sm flex flex-col items-center justify-center text-center min-h-[360px] border border-outline-variant/30">
                    <div className="w-16 h-16 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary-container mb-4 shadow-sm">
                        <span className="material-symbols-outlined text-[32px]">{icon}</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-bold">
                        {title} Console Module
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mb-6 leading-relaxed">
                        Full administrative management and data telemetry for {title.toLowerCase()}. Operational nodes are active and logging live events to the primary ledger.
                    </p>
                    <div className="flex items-center gap-3">
                        <Link
                            to="/admin/dashboard"
                            className="px-space-md py-2 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md font-semibold shadow-sm hover:bg-primary transition-colors flex items-center gap-1.5"
                        >
                            <span className="material-symbols-outlined text-[16px]">dashboard</span>
                            <span>Executive Dashboard</span>
                        </Link>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low text-xs text-on-surface-variant font-medium">
                            <span className="w-2 h-2 rounded-full bg-primary-container"></span>
                            <span>Audit Logging Enabled</span>
                        </span>
                    </div>
                </div>
            </div>
        </main>
    );
}

