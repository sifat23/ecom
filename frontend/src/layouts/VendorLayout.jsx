import { Outlet } from 'react-router-dom';
export default function VendorLayout() {
    return (
        <div className="min-h-screen flex">
            <aside className="w-64 bg-slate-900 text-white p-4">Vendor Sidebar</aside>
            <main className="flex-1 bg-slate-100 p-6"><Outlet /></main>
        </div>
    );
}