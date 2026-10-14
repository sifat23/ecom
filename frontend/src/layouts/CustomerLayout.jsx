// src/layouts/CustomerLayout.jsx
import { Outlet } from 'react-router-dom';
export default function CustomerLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <header className="bg-white shadow p-4 font-bold text-xl">Marketplace Storefront</header>
            <main className="flex-1 container mx-auto p-4"><Outlet /></main>
        </div>
    );
}