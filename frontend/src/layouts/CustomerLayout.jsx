// CustomerLayout.jsx
import { NavLink, Outlet } from 'react-router-dom';

const links = [
    { to: '/account',            label: 'Profile'   },
    { to: '/account/orders',     label: 'Orders'    },
    { to: '/account/addresses',  label: 'Addresses' },
    { to: '/account/security',   label: 'Security'  },
];

export default function CustomerLayout() {
    return (
        <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8">
            <aside className="w-56 shrink-0">
                <nav className="space-y-1">
                    {links.map((l) => (
                        <NavLink
                            key={l.to}
                            to={l.to}
                            end
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
            <section className="min-w-0 flex-1"><Outlet /></section>
        </div>
    );
}