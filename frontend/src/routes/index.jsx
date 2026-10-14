import { createBrowserRouter, Navigate } from 'react-router-dom';

import PublicLayout   from '../layouts/PublicLayout';
import CustomerLayout from '../layouts/CustomerLayout';
import VendorLayout   from '../layouts/VendorLayout';
import AdminLayout    from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';

import HomePage    from '../features/pages/HomePage';
import Placeholder from '../features/pages/Placeholder';

export const router = createBrowserRouter([
    // ── Public ────────────────────────────────────────────
    {
        element: <PublicLayout />,
        children: [
            { index: true,                        element: <HomePage /> },
            { path: 'category/:slug',             element: <Placeholder title="Category" /> },
            { path: 'search',                     element: <Placeholder title="Search" /> },
            { path: 'products/:slug',             element: <Placeholder title="Product Detail" /> },
            { path: 'vendors/:id',                element: <Placeholder title="Vendor Storefront" /> },
            { path: 'cart',                       element: <Placeholder title="Cart" /> },

            { path: 'login',                      element: <Placeholder title="Login" /> },
            { path: 'register',                   element: <Placeholder title="Register" /> },
            { path: 'forgot-password',            element: <Placeholder title="Forgot Password" /> },
            { path: 'reset-password/:token',      element: <Placeholder title="Reset Password" /> },

            { path: 'sell',                       element: <Placeholder title="Become a Seller" /> },

            // Checkout is auth-gated later; placeholder for now
            { path: 'checkout/address',           element: <Placeholder title="Checkout — Address" /> },
            { path: 'checkout/payment',           element: <Placeholder title="Checkout — Payment" /> },
            { path: 'checkout/success',           element: <Placeholder title="Order Confirmation" /> },

            { path: '403',                        element: <Placeholder title="403 — Forbidden" /> },
            { path: '500',                        element: <Placeholder title="500 — Server Error" /> },
            { path: '*',                          element: <Placeholder title="404 — Not Found" /> },
        ],
    },

    // ── Customer account ──────────────────────────────────
    {
        element: <ProtectedRoute context="user" />,
        children: [
            {
                path: 'account',
                element: <CustomerLayout />,
                children: [
                    { index: true,            element: <Placeholder title="My Profile" /> },
                    { path: 'orders',         element: <Placeholder title="My Orders" /> },
                    { path: 'orders/:id',     element: <Placeholder title="Order Detail" /> },
                    { path: 'addresses',      element: <Placeholder title="My Addresses" /> },
                    { path: 'security',       element: <Placeholder title="Change Password" /> },
                ],
            },
        ],
    },

    // ── Vendor dashboard ──────────────────────────────────
    {
        element: <ProtectedRoute context="user" roles={['vendor']} requireVendorApproved />,
        children: [
            {
                path: 'vendor',
                element: <VendorLayout />,
                children: [
                    { index: true,              element: <Navigate to="dashboard" replace /> },
                    { path: 'dashboard',        element: <Placeholder title="Vendor Dashboard" /> },
                    { path: 'products',         element: <Placeholder title="Product List" /> },
                    { path: 'products/new',     element: <Placeholder title="Add Product" /> },
                    { path: 'products/:id/edit',element: <Placeholder title="Edit Product" /> },
                    { path: 'orders',           element: <Placeholder title="Vendor Orders" /> },
                    { path: 'orders/:itemId',   element: <Placeholder title="Vendor Order Detail" /> },
                    { path: 'settings/profile', element: <Placeholder title="Vendor Profile Settings" /> },
                    { path: 'settings/payouts', element: <Placeholder title="Payout Settings" /> },
                ],
            },
        ],
    },

    // ── Admin ─────────────────────────────────────────────
    { path: 'admin/login', element: <Placeholder title="Admin Login" /> },
    {
        element: <ProtectedRoute context="admin" />,
        children: [
            {
                path: 'admin',
                element: <AdminLayout />,
                children: [
                    { index: true,          element: <Navigate to="dashboard" replace /> },
                    { path: 'dashboard',    element: <Placeholder title="Admin Dashboard" /> },
                    { path: 'vendors',      element: <Placeholder title="All Vendors" /> },
                    { path: 'vendors/:id',  element: <Placeholder title="Vendor Detail" /> },
                    { path: 'products',     element: <Placeholder title="Product Moderation" /> },
                    { path: 'products/:id', element: <Placeholder title="Product Detail" /> },
                    { path: 'orders',       element: <Placeholder title="All Orders" /> },
                    { path: 'orders/:id',   element: <Placeholder title="Order Detail" /> },
                    { path: 'categories',   element: <Placeholder title="Category Management" /> },
                    { path: 'activities',   element: <Placeholder title="Activity Log" /> },
                ],
            },
        ],
    },
]);