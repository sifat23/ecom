import { useState, useMemo } from 'react';

const INITIAL_ORDERS = [
    {
        id: '#MN-9481',
        time: 'Just now',
        customer: 'Elena Lindqvist',
        initials: 'EL',
        location: 'Stockholm, SE 🇸🇪',
        email: 'elena@lindqvist.se',
        item: 'Øresund Horologe Clock',
        skuDetails: 'Qty: 1 · Natural Waxed Oak',
        total: '$340.00',
        commission: 'Com: $68.00 (20%)',
        studio: 'Studio Vesterbro',
        studioLocation: 'Copenhagen Atelier',
        studioIcon: 'carpenter',
        status: 'Processing Order',
        statusColor: 'bg-tertiary-fixed text-on-tertiary-fixed',
        statusDot: 'bg-tertiary',
        actionLabel: 'Dispatch',
        actionClass: 'bg-surface-container hover:bg-surface-container-high text-on-surface',
        tag: 'action',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAy36pqzNGEsXzAm9od2uUFQ9M7E71uyeD_uKqvlwSV-eR9yyTNeX5FVzwAEOu-ZuAJpokHkn6OZR5MVVh4-atUuH-YZGsDEgxoBNmaLWTu2O5G66I4JauCKZidS7axI5BSfkSMyli8QGY7qGunyaUHir2XV9d7vqn3vFY3NO_NxH9wlriEpJH5HBPb9wyhK2RAGQGpmqhIIOYLmnUr2TVUc8anSesnQ7r7asRfOrDIL2nQzYceLZP_',
    },
    {
        id: '#MN-9480',
        time: '14 min ago',
        customer: 'Marcus Hayes',
        initials: 'MH',
        location: 'London, UK 🇬🇧',
        email: 'm.hayes@kensington.co.uk',
        item: 'Verdant Courier Tote',
        skuDetails: 'Qty: 1 · Tuscan Moss Calf',
        total: '$520.00',
        commission: 'Com: $104.00 (20%)',
        studio: 'Tuscany Leatherworks',
        studioLocation: 'Florence Workshop',
        studioIcon: 'local_florist',
        status: 'Customs Cleared',
        statusColor: 'bg-primary-fixed text-on-primary-fixed',
        statusDot: 'bg-primary-container',
        actionLabel: 'Track DHL',
        actionClass: 'bg-surface-container hover:bg-surface-container-high text-on-surface',
        tag: 'dhl',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPjbd9oEgXuI99uPl0iymFsE8zWwoaLv8tpXOBkY4mgTWIICGA0hj5PHFiZlDrzmirFRwPdACi143lbsUeldQGWAN-UaqIlCzxNs744-lpakAvKdv9jpmBbPACCGsxD3BiA7gLq0hkMC8RQLP02J73QcTogc_VtqbTUYVTSSpXGS1FwVXi4lHaJqQ2XY659ISg7WWEE-X9M0QGUC0AGGcqc2TFjr1bsfnhHHH1rM4npjAgpbO0jMTf',
    },
    {
        id: '#MN-9479',
        time: '48 min ago',
        customer: 'Aria Kurosawa',
        initials: 'AK',
        location: 'Kyoto, JP 🇯🇵',
        email: 'kurosawa@atelier.kyoto.jp',
        item: 'Herringbone Slub Throw',
        skuDetails: 'Qty: 2 · Organic Flax',
        total: '$290.00',
        commission: 'Com: $58.00 (20%)',
        studio: 'Guimarães Weavers',
        studioLocation: 'Portugal Mill',
        studioIcon: 'texture',
        status: 'In Transit (Air)',
        statusColor: 'bg-surface-container-high text-on-surface-variant',
        statusIcon: 'flight_takeoff',
        actionLabel: 'Manifest',
        actionClass: 'bg-surface-container hover:bg-surface-container-high text-on-surface',
        tag: 'dhl',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3nNh0frx-0IaynEutcgE0R464-hS6mVa8lTrc86K9zAveNblUMBEIjjYgI-x1FpIsllnPnbDBxTwu9yXZh3qiG88IZf9YmNWnIB0IL4lq1NVhCdalvQcVFmoO7xcw_9zNdavnN1KB2vdCnAO3KnXU95TnOTj-RxW-x0Z-EwP7z48JPqwlz9VnJoKqa7nSFs6S_9Yxy8UgnpOGtIdf2lSX2efZQflEbH73Oedzf3DKA9mDfRDeZ0B_',
    },
    {
        id: '#MN-9478',
        time: '1h 12m ago',
        customer: 'Chloe Saint-Laurent',
        initials: 'CS',
        initialsBg: 'bg-secondary-fixed text-on-secondary-fixed',
        location: 'Paris, FR 🇫🇷',
        email: 'chloe@saintlaurent.fr',
        item: 'Kupari Minimalist Teapot',
        skuDetails: 'Qty: 1 · Spun Raw Copper',
        total: '$185.00',
        commission: 'Com: $37.00 (20%)',
        studio: 'Fiskars Coppersmiths',
        studioLocation: 'Helsinki Studio',
        studioIcon: 'hardware',
        status: 'Address Verification',
        statusColor: 'bg-secondary-fixed text-on-secondary-fixed',
        statusIcon: 'warning',
        actionLabel: 'Verify Line',
        actionClass: 'bg-secondary-container text-on-secondary-container hover:opacity-90',
        tag: 'flagged',
        fallbackIcon: 'style',
    },
    {
        id: '#MN-9477',
        time: '1h 45m ago',
        customer: 'Daniel Bergström',
        initials: 'DB',
        location: 'Oslo, NO 🇳🇴',
        email: 'd.berg@fjordventures.no',
        item: 'Södermalm Low Derby',
        skuDetails: 'Qty: 1 · Matte Bark Black (EU 43)',
        total: '$460.00',
        commission: 'Com: $92.00 (20%)',
        studio: 'Nordic Cordwainers',
        studioLocation: 'Småland Cobbler',
        studioIcon: 'do_not_step',
        status: 'Out for Delivery',
        statusColor: 'bg-primary-fixed text-on-primary-fixed',
        statusIcon: 'local_shipping',
        actionLabel: 'Receipt',
        actionClass: 'bg-surface-container hover:bg-surface-container-high text-on-surface',
        tag: 'all',
        fallbackIcon: 'footprint',
    },
];

export default function AdminDashboardPage() {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastRefreshedText, setLastRefreshedText] = useState('30s');
    const [chartMode, setChartMode] = useState('gross'); // 'gross' | 'orders'
    const [activeTab, setActiveTab] = useState('all'); // 'all' | 'action' | 'dhl' | 'flagged'
    const [searchQuery, setSearchQuery] = useState('');
    const [copiedId, setCopiedId] = useState(null);
    const [dateRange, setDateRange] = useState('Oct 1 – Oct 24, 2025');
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [toastMessage, setToastMessage] = useState(null);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setIsRefreshing(false);
            setLastRefreshedText('Just now');
            showToast('Telemetry refreshed & synchronized (14ms latency).');
        }, 800);
    };

    const handleCopyId = (id) => {
        navigator.clipboard?.writeText(id);
        setCopiedId(id);
        showToast(`Copied ${id} to clipboard`);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleExportCSV = () => {
        const headers = ['Order ID', 'Customer', 'Email', 'Location', 'Item', 'Total', 'Commission', 'Studio', 'Status'];
        const rows = INITIAL_ORDERS.map((o) => [
            o.id,
            o.customer,
            o.email,
            o.location.replace(/[^a-zA-Z, ]/g, '').trim(),
            o.item,
            o.total,
            o.commission,
            o.studio,
            o.status,
        ]);
        const csvContent = [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `financial-ledger-${dateRange.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Financial ledger CSV exported successfully');
    };

    // Filter table orders
    const filteredOrders = useMemo(() => {
        return INITIAL_ORDERS.filter((order) => {
            if (activeTab === 'action' && order.tag !== 'action') return false;
            if (activeTab === 'dhl' && order.tag !== 'dhl') return false;
            if (activeTab === 'flagged' && order.tag !== 'flagged') return false;

            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchId = order.id.toLowerCase().includes(q);
                const matchCust = order.customer.toLowerCase().includes(q);
                const matchItem = order.item.toLowerCase().includes(q);
                const matchStudio = order.studio.toLowerCase().includes(q);
                const matchLocation = order.location.toLowerCase().includes(q);
                return matchId || matchCust || matchItem || matchStudio || matchLocation;
            }
            return true;
        });
    }, [activeTab, searchQuery]);

    return (
        <main className="relative pt-24 sm:pt-28 pb-16 bg-surface flex-1 w-full px-space-lg">
            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-bounce">
                    <span className="material-symbols-outlined text-[16px] text-primary-fixed">verified</span>
                    <span>{toastMessage}</span>
                </div>
            )}

            <div className="flex flex-col w-full gap-space-lg">
                {/* ── Top Executive Action Header ────────────────────── */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
                    <div className="flex flex-col gap-space-xs max-w-2xl">
                        <div className="inline-flex items-center gap-space-xs text-primary font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                            <span className="w-2 h-2 rounded-full bg-primary-container animate-ping"></span>
                            <span>Atelier Telemetry · Live Node Production</span>
                        </div>
                        <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                            Executive Overview &amp; Operations
                        </h1>
                        <p className="font-body-md text-body-md text-on-surface-variant">
                            Real-time commerce telemetry across Copenhagen, Stockholm, and global boutique dispatches.
                        </p>
                    </div>

                    {/* Controls Ribbon */}
                    <div className="flex flex-wrap items-center gap-space-sm relative">
                        {/* Date Filter */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setDatePickerOpen(!datePickerOpen)}
                                className="flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container font-label-md text-label-md shadow-sm transition-all duration-150 cursor-pointer"
                                id="dateRangeBtn"
                            >
                                <span className="material-symbols-outlined text-[18px] text-outline">calendar_month</span>
                                <span>{dateRange}</span>
                                <span className="material-symbols-outlined text-[16px] text-outline">expand_more</span>
                            </button>

                            {datePickerOpen && (
                                <div className="absolute left-0 top-full mt-1.5 w-56 p-1.5 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/40 flex flex-col gap-1 z-50">
                                    {[
                                        'Oct 1 – Oct 24, 2025',
                                        'Trailing 30 Days',
                                        'Q3 2025 Full Cycle',
                                        'Year to Date (2025)',
                                    ].map((opt) => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => {
                                                setDateRange(opt);
                                                setDatePickerOpen(false);
                                                showToast(`Range updated: ${opt}`);
                                            }}
                                            className={`text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                                dateRange === opt
                                                    ? 'bg-primary-container text-on-primary font-bold'
                                                    : 'text-on-surface hover:bg-surface-container'
                                            }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Export CSV */}
                        <button
                            type="button"
                            onClick={handleExportCSV}
                            className="flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-md text-label-md shadow-sm transition-all duration-150 cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[18px] text-primary">download</span>
                            <span>Export Financial Ledger</span>
                            <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-semibold">
                                CSV
                            </span>
                        </button>

                        {/* Live Refresh Heartbeat */}
                        <button
                            type="button"
                            onClick={handleRefresh}
                            className="flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md shadow-sm transition-all duration-150 cursor-pointer"
                            id="refreshTrigger"
                        >
                            <span
                                className={`material-symbols-outlined text-[18px] ${isRefreshing ? 'animate-spin' : ''}`}
                                id="refreshIcon"
                            >
                                sync
                            </span>
                            <span>Live Refresh</span>
                            <span className="text-on-primary-container text-[11px] font-label-sm">{lastRefreshedText}</span>
                        </button>
                    </div>
                </div>

                {/* ── Primary Metric Grid (4 Bento Stat Cards) ────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
                    {/* Stat 1: GMV */}
                    <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-200 relative overflow-hidden group">
                        <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-primary-container/5 pointer-events-none group-hover:scale-125 transition-transform duration-300"></div>
                        <div className="flex flex-col gap-space-xs">
                            <div className="flex items-center justify-between">
                                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                                    Gross Merchandise Value
                                </span>
                                <span className="p-1.5 rounded-lg bg-surface-container-low text-primary flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[18px]">payments</span>
                                </span>
                            </div>
                            <div className="flex items-baseline gap-space-xs mt-space-xs">
                                <span className="font-display-hero-mobile text-display-hero-mobile text-on-surface font-bold tracking-tight">
                                    $248,920<span className="text-outline text-headline-sm">.00</span>
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-space-md pt-space-sm">
                            <div className="flex items-center gap-1 text-primary-container font-label-md text-label-md font-bold">
                                <span className="material-symbols-outlined text-[18px]">trending_up</span>
                                <span>+14.8%</span>
                                <span className="text-outline font-normal font-body-sm text-body-sm">vs Sep</span>
                            </div>
                            <div className="flex items-center gap-1 px-space-xs py-0.5 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
                                <span>+$8,420 today</span>
                            </div>
                        </div>
                        {/* Micro Sparkline SVG */}
                        <div className="mt-space-xs w-full h-8 flex items-end">
                            <svg className="w-full h-7 text-primary-container" fill="none" preserveAspectRatio="none" viewBox="0 0 100 24">
                                <path
                                    d="M0 20 L15 17 L30 19 L45 12 L60 14 L75 8 L90 10 L100 3"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2.5"
                                />
                                <path
                                    d="M0 20 L15 17 L30 19 L45 12 L60 14 L75 8 L90 10 L100 3 L100 24 L0 24 Z"
                                    fill="currentColor"
                                    fillOpacity="0.08"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Stat 2: Platform Revenue */}
                    <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-200 relative overflow-hidden group">
                        <div className="flex flex-col gap-space-xs">
                            <div className="flex items-center justify-between">
                                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                                    Net Platform Revenue
                                </span>
                                <span className="p-1.5 rounded-lg bg-surface-container-low text-primary-container flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                                </span>
                            </div>
                            <div className="flex items-baseline gap-space-xs mt-space-xs">
                                <span className="font-display-hero-mobile text-display-hero-mobile text-on-surface font-bold tracking-tight">
                                    $49,784<span className="text-outline text-headline-sm">.00</span>
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-space-md pt-space-sm">
                            <div className="flex items-center gap-1 text-primary-container font-label-md text-label-md font-bold">
                                <span className="material-symbols-outlined text-[18px]">trending_up</span>
                                <span>+11.2%</span>
                                <span className="text-outline font-normal font-body-sm text-body-sm">net margin</span>
                            </div>
                            <span className="font-label-sm text-label-sm text-outline">20% commission</span>
                        </div>
                        {/* Commission Progress Track */}
                        <div className="mt-space-sm flex flex-col gap-1">
                            <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
                                <span>Escrow Captured</span>
                                <span className="font-semibold text-primary">100% Guaranteed</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden">
                                <div className="h-full bg-primary-container rounded-full w-[88%]"></div>
                            </div>
                        </div>
                    </div>

                    {/* Stat 3: Active Orders */}
                    <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-200 relative overflow-hidden group">
                        <div className="flex flex-col gap-space-xs">
                            <div className="flex items-center justify-between">
                                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                                    Active Orders &amp; SLA
                                </span>
                                <span className="p-1.5 rounded-lg bg-surface-container-low text-secondary flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                                </span>
                            </div>
                            <div className="flex items-baseline gap-space-xs mt-space-xs">
                                <span className="font-display-hero-mobile text-display-hero-mobile text-on-surface font-bold tracking-tight">
                                    1,428
                                </span>
                                <span className="font-body-md text-body-md text-outline">in transit</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-space-md pt-space-sm">
                            <div className="flex items-center gap-1 text-primary font-label-md text-label-md font-semibold">
                                <span className="material-symbols-outlined text-[18px] text-primary-container">verified</span>
                                <span>98.4% SLA</span>
                            </div>
                            <span className="px-space-xs py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold">
                                38 dispatch pending
                            </span>
                        </div>
                        {/* Order Flow Micro Indicators */}
                        <div className="mt-space-sm grid grid-cols-3 gap-1 text-center font-label-sm text-label-sm">
                            <div className="py-1 rounded bg-surface-container-low flex flex-col">
                                <span className="font-bold text-on-surface">1,090</span>
                                <span className="text-[10px] text-outline">Dispatched</span>
                            </div>
                            <div className="py-1 rounded bg-surface-container-low flex flex-col">
                                <span className="font-bold text-on-surface">300</span>
                                <span className="text-[10px] text-outline">Customs</span>
                            </div>
                            <div className="py-1 rounded bg-secondary-fixed text-on-secondary-fixed flex flex-col">
                                <span className="font-bold">38</span>
                                <span className="text-[10px]">Action</span>
                            </div>
                        </div>
                    </div>

                    {/* Stat 4: Artisan Workshop Payouts */}
                    <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-200 relative overflow-hidden group">
                        <div className="flex flex-col gap-space-xs">
                            <div className="flex items-center justify-between">
                                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                                    Artisan Payouts
                                </span>
                                <span className="p-1.5 rounded-lg bg-surface-container-low text-tertiary-fixed-dim flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[18px]">handshake</span>
                                </span>
                            </div>
                            <div className="flex items-baseline gap-space-xs mt-space-xs">
                                <span className="font-display-hero-mobile text-display-hero-mobile text-on-surface font-bold tracking-tight">
                                    $199,136<span className="text-outline text-headline-sm">.00</span>
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-space-md pt-space-sm">
                            <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
                                <span className="material-symbols-outlined text-[16px] text-primary">lock</span>
                                <span>Stripe Connect Escrow</span>
                            </div>
                            <div className="flex items-center gap-1 px-space-xs py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-semibold">
                                <span className="material-symbols-outlined text-[13px]">schedule</span>
                                <span>Batch in 4 hrs</span>
                            </div>
                        </div>
                        {/* Trust & Transparency Tag */}
                        <div className="mt-space-sm flex items-center gap-space-xs px-space-sm py-1 rounded bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm">
                            <span className="material-symbols-outlined text-[16px] text-primary">eco</span>
                            <span className="truncate">Fair Artisan Guild: 100% compliant</span>
                        </div>
                    </div>
                </div>

                {/* ── Dual Visualizations (Analytics & Warehouse Nodes) ─ */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
                    {/* Chart: Revenue & Volume Velocity (8 Cols) */}
                    <div className="lg:col-span-8 p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-space-md">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                            <div className="flex flex-col">
                                <div className="flex items-center gap-space-xs">
                                    <h2 className="font-headline-sm text-headline-sm text-on-surface">
                                        Revenue Velocity &amp; Monthly Milestones
                                    </h2>
                                    <span className="px-space-xs py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">
                                        2025 Cycle
                                    </span>
                                </div>
                                <p className="font-body-sm text-body-sm text-on-surface-variant">
                                    May through October trailing gross volume across global ateliers.
                                </p>
                            </div>
                            {/* Legend & Mode Switcher */}
                            <div className="flex items-center gap-space-xs bg-surface-container-low p-1 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => setChartMode('gross')}
                                    className={`px-space-sm py-1 rounded-md font-label-sm text-label-sm font-semibold transition-all cursor-pointer ${
                                        chartMode === 'gross'
                                            ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                                            : 'text-on-surface-variant hover:text-on-surface'
                                    }`}
                                >
                                    Gross Value
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setChartMode('orders')}
                                    className={`px-space-sm py-1 rounded-md font-label-sm text-label-sm font-semibold transition-all cursor-pointer ${
                                        chartMode === 'orders'
                                            ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                                            : 'text-on-surface-variant hover:text-on-surface'
                                    }`}
                                >
                                    Orders Count
                                </button>
                            </div>
                        </div>

                        {/* Inline SVG Velocity Chart with Interactive Markers */}
                        <div className="w-full h-64 relative flex items-end pt-4">
                            {/* Horizontal Guide Lines */}
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                                <div className="w-full border-b border-outline"></div>
                                <div className="w-full border-b border-outline"></div>
                                <div className="w-full border-b border-outline"></div>
                                <div className="w-full border-b border-outline"></div>
                            </div>
                            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 700 200">
                                <defs>
                                    <linearGradient id="forestFade" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#1b4d3e" stopOpacity="0.25"></stop>
                                        <stop offset="100%" stopColor="#1b4d3e" stopOpacity="0.0"></stop>
                                    </linearGradient>
                                </defs>
                                {/* Shadow Area Under Curve */}
                                <path
                                    d="M 0 170 C 70 160, 100 140, 140 135 C 180 130, 220 150, 280 110 C 340 70, 390 95, 420 85 C 470 75, 520 40, 560 30 C 620 20, 660 15, 700 10 L 700 200 L 0 200 Z"
                                    fill="url(#forestFade)"
                                ></path>
                                {/* Target Benchmark dashed line */}
                                <path d="M 0 100 L 700 50" fill="none" stroke="#c0c9c3" strokeDasharray="4 4" strokeWidth="1.5"></path>
                                {/* Main Velocity Line */}
                                <path
                                    d="M 0 170 C 70 160, 100 140, 140 135 C 180 130, 220 150, 280 110 C 340 70, 390 95, 420 85 C 470 75, 520 40, 560 30 C 620 20, 660 15, 700 10"
                                    fill="none"
                                    stroke="#1b4d3e"
                                    strokeLinecap="round"
                                    strokeWidth="3.5"
                                ></path>
                                {/* Interactive Milestone Markers */}
                                <g className="cursor-pointer group" onClick={() => showToast('Jun Milestone: $168,000 GMV')}>
                                    <circle cx="140" cy="135" fill="#ffffff" r="4" stroke="#1b4d3e" strokeWidth="3"></circle>
                                </g>
                                <g className="cursor-pointer group" onClick={() => showToast('Aug Milestone: $194,000 GMV')}>
                                    <circle cx="280" cy="110" fill="#ffffff" r="4" stroke="#1b4d3e" strokeWidth="3"></circle>
                                </g>
                                <g className="cursor-pointer group" onClick={() => showToast('Sep Milestone: $216,000 GMV')}>
                                    <circle cx="420" cy="85" fill="#ffffff" r="4" stroke="#1b4d3e" strokeWidth="3"></circle>
                                </g>
                                {/* Peak Oct Pin */}
                                <g className="cursor-pointer" onClick={() => showToast('ATH Record October: $248,920 GMV')}>
                                    <circle cx="700" cy="10" fill="#1b4d3e" r="6" stroke="#ffffff" strokeWidth="2"></circle>
                                </g>
                            </svg>
                            {/* Dynamic Floating Marker Pill */}
                            <div className="absolute right-0 top-1 -translate-y-full flex flex-col items-end">
                                <div className="px-space-xs py-1 rounded bg-primary-container text-on-primary font-label-sm text-label-sm shadow-md flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim"></span>
                                    <span>ATH Peak: $248.9k</span>
                                </div>
                            </div>
                        </div>

                        {/* X-Axis Months Label Track */}
                        <div className="flex items-center justify-between font-label-sm text-label-sm text-outline pt-space-xs">
                            <span>May ($142k)</span>
                            <span>Jun ($168k)</span>
                            <span>Jul ($159k)</span>
                            <span>Aug ($194k)</span>
                            <span>Sep ($216k)</span>
                            <span className="font-bold text-primary">Oct ($248.9k Current)</span>
                        </div>

                        {/* Category Revenue Contribution Breakdown */}
                        <div className="pt-space-md flex flex-col gap-space-xs bg-surface-container-low/60 p-space-md rounded-lg">
                            <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
                                <span className="font-semibold uppercase tracking-wider text-outline text-[11px]">
                                    Category GMV Share
                                </span>
                                <span className="text-primary font-semibold">Total Portfolios: 3 Pillars</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-space-sm pt-space-xs">
                                <div className="flex items-center gap-space-xs px-space-sm py-1.5 rounded-full bg-surface-container-lowest shadow-xs text-on-surface font-label-md text-label-md">
                                    <span className="w-2.5 h-2.5 rounded-full bg-primary-container"></span>
                                    <span className="font-semibold">Footwear &amp; Carry</span>
                                    <span className="text-primary font-bold">44%</span>
                                    <span className="text-outline font-body-sm text-body-sm">($109.5k)</span>
                                </div>
                                <div className="flex items-center gap-space-xs px-space-sm py-1.5 rounded-full bg-surface-container-lowest shadow-xs text-on-surface font-label-md text-label-md">
                                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed-dim"></span>
                                    <span className="font-semibold">Home &amp; Living</span>
                                    <span className="text-tertiary-container font-bold">32%</span>
                                    <span className="text-outline font-body-sm text-body-sm">($79.6k)</span>
                                </div>
                                <div className="flex items-center gap-space-xs px-space-sm py-1.5 rounded-full bg-surface-container-lowest shadow-xs text-on-surface font-label-md text-label-md">
                                    <span className="w-2.5 h-2.5 rounded-full bg-secondary-container"></span>
                                    <span className="font-semibold">Studio Apparel</span>
                                    <span className="text-secondary font-bold">24%</span>
                                    <span className="text-outline font-body-sm text-body-sm">($59.7k)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Telemetry: Live Fulfillment & Hub Nodes (4 Cols) */}
                    <div className="lg:col-span-4 p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-space-md">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <h2 className="font-headline-sm text-headline-sm text-on-surface">Fulfillment Telemetry</h2>
                                <span className="font-body-sm text-body-sm text-on-surface-variant">Live boutique logistics nodes</span>
                            </div>
                            <span className="p-1.5 rounded-lg bg-surface-container-low text-primary flex items-center justify-center">
                                <span className="material-symbols-outlined text-[20px]">hub</span>
                            </span>
                        </div>

                        {/* Regional Distribution List */}
                        <div className="flex flex-col gap-space-sm">
                            {/* Hub 1 */}
                            <div className="p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-between">
                                <div className="flex items-center gap-space-sm">
                                    <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center text-sm font-bold">
                                        CPH
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-label-md text-label-md font-semibold text-on-surface">
                                            Nordic Central
                                        </span>
                                        <span className="font-body-sm text-body-sm text-outline">
                                            Copenhagen Hub · 482 parcels
                                        </span>
                                    </div>
                                </div>
                                <span className="px-space-xs py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">
                                    Nominal
                                </span>
                            </div>

                            {/* Hub 2 */}
                            <div className="p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-between">
                                <div className="flex items-center gap-space-sm">
                                    <div className="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center text-sm font-bold">
                                        FRA
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-label-md text-label-md font-semibold text-on-surface">
                                            Western Europe
                                        </span>
                                        <span className="font-body-sm text-body-sm text-outline">
                                            Frankfurt Atelier · 310 parcels
                                        </span>
                                    </div>
                                </div>
                                <span className="px-space-xs py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">
                                    Nominal
                                </span>
                            </div>

                            {/* Hub 3 */}
                            <div className="p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-between">
                                <div className="flex items-center gap-space-sm">
                                    <div className="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center text-sm font-bold">
                                        NYC
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-label-md text-label-md font-semibold text-on-surface">
                                            North America
                                        </span>
                                        <span className="font-body-sm text-body-sm text-outline">
                                            New York Terminal · 636 parcels
                                        </span>
                                    </div>
                                </div>
                                <span className="px-space-xs py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-semibold">
                                    High Volume
                                </span>
                            </div>
                        </div>

                        {/* Health Bar Metric */}
                        <div className="flex flex-col gap-space-xs p-space-sm rounded-lg bg-surface-container-low">
                            <div className="flex items-center justify-between font-label-sm text-label-sm">
                                <span className="text-on-surface font-semibold flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
                                    Capacity SLA Health
                                </span>
                                <span className="font-bold text-primary">99.1%</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
                                <div className="h-full bg-primary-container rounded-full w-[99.1%]"></div>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-outline font-label-sm">
                                <span>0 customs bottlenecks</span>
                                <span>Avg dispatch: 11.4h</span>
                            </div>
                        </div>

                        {/* Atelier Mini Visual Feature */}
                        <div className="relative rounded-lg overflow-hidden h-28 bg-surface-container group">
                            <div
                                className="bg-cover bg-center w-full h-full group-hover:scale-105 transition-transform duration-500"
                                style={{
                                    backgroundImage:
                                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCvRZZ4iYoZusiFtTjSiT1C_2i-Hz1lxxdQBzIqKfv8llWStYc8_KmOyLVze4XGGc3z88eRlPb1Bog0PrKa40QkfbDf_W0QhM4W0Gv3Z0-utdzTeYKyW4UPqEz7Sv2TN9kIX9EjX-QWGp_urChepCAoGqSoTmdaiKZQ9VNpMw6fl64RJo_J5p8dUMZOkwfjGYoNhsqvJ8b67WFTRXts_le1Hd4e3m5OaxcQIyrDsnt-miARQ6ZSAZax')",
                                }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-space-sm">
                                <div className="flex items-center justify-between w-full text-white">
                                    <span className="font-label-sm text-label-sm font-semibold">
                                        København Artisan Guild #04
                                    </span>
                                    <span className="font-label-sm text-label-sm text-primary-fixed flex items-center gap-1">
                                        Active Batch <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Bottom Section: High-Priority Orders Triage Table ── */}
                <div className="flex flex-col rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden">
                    {/* Table Header & Controls Bar */}
                    <div className="p-space-lg flex flex-col lg:flex-row lg:items-center justify-between gap-space-md bg-surface-container-lowest">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-space-sm">
                                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                                    Recent High-Priority Dispatch Triage
                                </h2>
                                <span className="px-space-xs py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold">
                                    Live Queue
                                </span>
                            </div>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                                Real-time order line validation, atelier fulfillment tracing, and export customs clearance.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-space-sm">
                            {/* Table Search */}
                            <div className="relative w-64">
                                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                                    search
                                </span>
                                <input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface placeholder-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary-container transition-all"
                                    placeholder="Search orders, clients, artisans..."
                                    type="text"
                                />
                            </div>

                            {/* Filter Quick Tabs */}
                            <div className="flex items-center bg-surface-container-low p-1 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('all')}
                                    className={`px-space-sm py-1 rounded-md font-label-sm text-label-sm font-semibold transition-all cursor-pointer ${
                                        activeTab === 'all'
                                            ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                                            : 'text-on-surface-variant hover:text-on-surface'
                                    }`}
                                >
                                    All ({INITIAL_ORDERS.length})
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('action')}
                                    className={`px-space-sm py-1 rounded-md font-label-sm text-label-sm font-semibold transition-all cursor-pointer ${
                                        activeTab === 'action'
                                            ? 'bg-surface-container-lowest text-secondary shadow-xs'
                                            : 'text-secondary hover:bg-surface-container/60'
                                    }`}
                                >
                                    Action (1)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('dhl')}
                                    className={`px-space-sm py-1 rounded-md font-label-sm text-label-sm font-semibold transition-all cursor-pointer ${
                                        activeTab === 'dhl'
                                            ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                                            : 'text-on-surface-variant hover:text-on-surface'
                                    }`}
                                >
                                    DHL Express (2)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('flagged')}
                                    className={`px-space-sm py-1 rounded-md font-label-sm text-label-sm transition-all flex items-center gap-1 cursor-pointer ${
                                        activeTab === 'flagged'
                                            ? 'bg-surface-container-lowest text-on-surface font-semibold shadow-xs'
                                            : 'text-on-surface-variant hover:text-on-surface'
                                    }`}
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                                    <span>Flagged (1)</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Responsive Table Container */}
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-left font-body-sm text-body-sm">
                            <thead>
                                <tr className="bg-surface-container-low/70 font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                                    <th className="py-space-sm px-space-lg">Order ID</th>
                                    <th className="py-space-sm px-space-md">Customer &amp; Destination</th>
                                    <th className="py-space-sm px-space-md">Items &amp; SKU Summary</th>
                                    <th className="py-space-sm px-space-md">Total / Escrow</th>
                                    <th className="py-space-sm px-space-md">Artisan Studio</th>
                                    <th className="py-space-sm px-space-md">Fulfillment Status</th>
                                    <th className="py-space-sm px-space-lg text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-on-surface divide-y divide-surface-container-low">
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="py-12 text-center text-on-surface-variant">
                                            <span className="material-symbols-outlined text-[32px] text-outline">search_off</span>
                                            <p className="mt-2 text-sm font-medium">No order dispatches match your filter.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-surface-container-low/50 transition-colors group">
                                            <td className="py-space-md px-space-lg">
                                                <div className="flex items-center gap-space-xs">
                                                    <span className="font-semibold text-primary font-label-md text-label-md">
                                                        {order.id}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCopyId(order.id)}
                                                        className="material-symbols-outlined text-[16px] text-outline opacity-0 group-hover:opacity-100 hover:text-primary cursor-pointer transition-opacity"
                                                        title="Copy ID"
                                                    >
                                                        {copiedId === order.id ? 'check' : 'content_copy'}
                                                    </button>
                                                </div>
                                                <span className="font-label-sm text-label-sm text-outline">{order.time}</span>
                                            </td>

                                            <td className="py-space-md px-space-md">
                                                <div className="flex items-center gap-space-sm">
                                                    <div
                                                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] ${
                                                            order.initialsBg || 'bg-surface-container-high text-on-surface'
                                                        }`}
                                                    >
                                                        {order.initials}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold font-label-md text-label-md text-on-surface">
                                                            {order.customer}
                                                        </span>
                                                        <span className="font-body-sm text-body-sm text-outline flex items-center gap-1">
                                                            <span>{order.location}</span> · {order.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-space-md px-space-md">
                                                <div className="flex items-center gap-space-sm">
                                                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-container shrink-0 flex items-center justify-center">
                                                        {order.imageUrl ? (
                                                            <img
                                                                className="w-full h-full object-cover"
                                                                src={order.imageUrl}
                                                                alt={order.item}
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-surface-container-high flex items-center justify-center text-outline">
                                                                <span className="material-symbols-outlined text-[20px]">
                                                                    {order.fallbackIcon || 'style'}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-on-surface truncate max-w-[180px]">
                                                            {order.item}
                                                        </span>
                                                        <span className="text-outline text-body-sm">{order.skuDetails}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-space-md px-space-md">
                                                <div className="flex flex-col">
                                                    <span className="font-bold font-price-lg text-price-lg text-on-surface">
                                                        {order.total}
                                                    </span>
                                                    <span className="text-primary font-label-sm text-label-sm">
                                                        {order.commission}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="py-space-md px-space-md">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-[16px] text-primary">
                                                        {order.studioIcon}
                                                    </span>
                                                    <span className="font-semibold text-on-surface">{order.studio}</span>
                                                </div>
                                                <span className="text-[11px] text-outline font-label-sm">
                                                    {order.studioLocation}
                                                </span>
                                            </td>

                                            <td className="py-space-md px-space-md">
                                                <span
                                                    className={`inline-flex items-center gap-1 px-space-xs py-1 rounded-full font-label-sm text-label-sm font-semibold ${order.statusColor}`}
                                                >
                                                    {order.statusDot && (
                                                        <span className={`w-1.5 h-1.5 rounded-full ${order.statusDot}`}></span>
                                                    )}
                                                    {order.statusIcon && (
                                                        <span className="material-symbols-outlined text-[14px]">
                                                            {order.statusIcon}
                                                        </span>
                                                    )}
                                                    <span>{order.status}</span>
                                                </span>
                                            </td>

                                            <td className="py-space-md px-space-lg text-right">
                                                <div className="flex items-center justify-end gap-space-xs">
                                                    <button
                                                        type="button"
                                                        onClick={() => showToast(`Action executed: ${order.actionLabel} for ${order.id}`)}
                                                        className={`px-space-sm py-1 rounded font-label-sm text-label-sm font-semibold transition-colors cursor-pointer ${order.actionClass}`}
                                                    >
                                                        {order.actionLabel}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        aria-label="Order detail options"
                                                        onClick={() => showToast(`Options opened for order ${order.id}`)}
                                                        className="p-1 rounded hover:bg-surface-container text-outline hover:text-on-surface transition-colors cursor-pointer"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Table Pagination & Bulk Status */}
                    <div className="p-space-md bg-surface-container-low/40 flex flex-col sm:flex-row items-center justify-between gap-space-sm font-label-sm text-label-sm text-outline">
                        <div className="flex items-center gap-space-sm">
                            <span>Displaying 1–5 of 1,428 active operations</span>
                            <span className="w-1 h-1 rounded-full bg-outline"></span>
                            <span className="text-primary font-semibold">100% Data integrity verified</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="p-1.5 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-on-surface disabled:opacity-40 cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                            </button>
                            {[1, 2, 3].map((num) => (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => setCurrentPage(num)}
                                    className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
                                        currentPage === num
                                            ? 'bg-primary-container text-on-primary'
                                            : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface'
                                    }`}
                                >
                                    {num}
                                </button>
                            ))}
                            <span className="px-1 text-outline">...</span>
                            <button
                                type="button"
                                onClick={() => setCurrentPage(286)}
                                className={`px-2.5 py-1 rounded-md cursor-pointer ${
                                    currentPage === 286
                                        ? 'bg-primary-container text-on-primary font-semibold'
                                        : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface'
                                }`}
                            >
                                286
                            </button>
                            <button
                                type="button"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                className="p-1.5 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-on-surface cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
