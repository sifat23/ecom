// VendorLayout.jsx
import { NavLink, Outlet } from 'react-router-dom';

const links = [
    { to: '/vendor/dashboard',        label: 'Dashboard' },
    { to: '/vendor/products',         label: 'Products'  },
    { to: '/vendor/orders',           label: 'Orders'    },
    { to: '/vendor/settings/profile', label: 'Settings'  },
];

export default function VendorLayout() {
    return (
        <div className="flex min-h-screen">
            <aside className="w-60 shrink-0 border-r border-slate-200 bg-white p-4">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Vendor
                </p>
                <nav className="space-y-1">
                    {links.map((l) => (
                        <NavLink
                            key={l.to}
                            to={l.to}
                            className={({ isActive }) =>
                                `block rounded-md px-3 py-2 text-sm ${
                                    isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'
                                }`
                            }
                        >
                            {l.label}
                        </NavLink>
                    ))}
                </nav>
            </aside>
            <main className="min-w-0 flex-1 p-8"><Outlet /></main>
        </div>
    );
}