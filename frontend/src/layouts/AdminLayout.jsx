import { Outlet } from 'react-router-dom';
export default function AdminLayout() {
    return (
        <div className="min-h-screen flex">
            <aside className="w-64 bg-red-950 text-white p-4">Admin Sidebar</aside>
            <main className="flex-1 bg-red-50 p-6"><Outlet /></main>
        </div>
    );
}