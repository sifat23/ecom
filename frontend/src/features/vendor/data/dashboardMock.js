// Mock data — replace with RTK Query hooks in Phase 3/6.
// Kept colocated with the vendor feature so it's easy to delete later.

const initials = (title) =>
    title
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();

export const dashboardStats = {
    revenue30d: 12480.5,
    revenueChange: 12.4, // percent, positive = up
    orders30d: 87,
    ordersChange: 8.2,
    activeProducts: 24,
    lowStockCount: 3,
    avgRating: 4.8,
    reviewCount: 128,
};

export const salesSeries = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [1240, 1890, 1420, 2210, 2680, 3120, 1920],
    currency: 'USD',
};

export const recentOrders = [
    { id: 'ORD-2841', customer: 'Sarah Mitchell',   items: 2, total: 149.0,  status: 'processing',  placedAt: '2h ago'  },
    { id: 'ORD-2839', customer: 'Daniel Okafor',    items: 1, total: 89.99,  status: 'shipped',     placedAt: '5h ago'  },
    { id: 'ORD-2836', customer: 'Priya Raman',      items: 3, total: 318.5,  status: 'processing',  placedAt: '9h ago'  },
    { id: 'ORD-2830', customer: 'Marco Bellini',    items: 1, total: 74.0,   status: 'delivered',   placedAt: '1d ago'  },
    { id: 'ORD-2827', customer: 'Hannah Lee',       items: 4, total: 512.25, status: 'delivered',   placedAt: '2d ago'  },
];

export const lowStockProducts = [
    { id: 'p_ls_1', title: '14" Ultrabook — 16GB / 512GB', sku: 'ULT-14-512', remaining: 2,  threshold: 5,  initials: initials('14 Ultrabook') },
    { id: 'p_ls_2', title: 'Wi-Fi 6E Mesh Router (3-pack)', sku: 'RTR-6E-3PK', remaining: 4,  threshold: 10, initials: initials('Mesh Router') },
    { id: 'p_ls_3', title: 'Amber Oud Eau de Parfum 50ml',  sku: 'PRF-AMB-50', remaining: 6,  threshold: 15, initials: initials('Amber Oud') },
];

export const topProducts = [
    { id: 'p_tp_1', title: '27" 4K IPS Monitor',           unitsSold: 42, revenue: 13818.0, initials: initials('4K Monitor') },
    { id: 'p_tp_2', title: 'Wireless Mechanical Keyboard', unitsSold: 68, revenue: 6119.32, initials: initials('Wireless Keyboard') },
    { id: 'p_tp_3', title: 'Amber Oud Eau de Parfum 50ml', unitsSold: 51, revenue: 3774.0,  initials: initials('Amber Oud') },
    { id: 'p_tp_4', title: 'Wi-Fi 6E Mesh Router (3-pack)',unitsSold: 14, revenue: 3493.0,  initials: initials('Mesh Router') },
];

/* ── Helpers ───────────────────────────────────────────── */

export const ORDER_STATUS_STYLES = {
    processing: 'bg-tertiary-fixed text-on-tertiary-fixed',
    shipped:    'bg-primary-fixed text-on-primary-fixed',
    delivered:  'bg-surface-container-high text-on-surface',
    cancelled:  'bg-error-container text-on-error-container',
};

export const money = (n) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2,
    }).format(n);

export const compactMoney = (n) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(n);