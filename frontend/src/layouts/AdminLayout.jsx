// AdminLayout.jsx
import { NavLink, Outlet } from 'react-router-dom';

const links = [
    { to: '/admin/dashboard',  label: 'Dashboard'  },
    { to: '/admin/vendors',    label: 'Vendors'    },
    { to: '/admin/products',   label: 'Products'   },
    { to: '/admin/orders',     label: 'Orders'     },
    { to: '/admin/categories', label: 'Categories' },
    { to: '/admin/activities', label: 'Activity'   },
];

export default function AdminLayout() {
    return (
        <div className="flex min-h-screen bg-slate-100">
            <aside className="w-60 shrink-0 border-r border-slate-200 bg-slate-900 p-4 text-slate-100">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Admin
                </p>
                <nav className="space-y-1">
                    {links.map((l) => (
                        <NavLink
                            key={l.to}
                            to={l.to}
                            className={({ isActive }) =>
                                `block rounded-md px-3 py-2 text-sm ${
                                    isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800'
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