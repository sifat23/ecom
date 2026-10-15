import { createBrowserRouter, Navigate } from 'react-router-dom';

import PublicLayout from '../layouts/PublicLayout';
import CustomerLayout from '../layouts/CustomerLayout';
import VendorLayout from '../layouts/VendorLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import GuestRoute from './GuestRoute';

import HomePage from '../features/pages/HomePage';
import Placeholder from '../features/pages/Placeholder';

import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import ForgotPasswordPage from '../features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from '../features/auth/pages/ResetPasswordPage';
import AdminLoginPage from '../features/auth/pages/AdminLoginPage';

import SellLandingPage from '../features/vendor/pages/SellLandingPage';
import VendorRegisterPage from '../features/vendor/pages/VendorRegisterPage';
import StripeOnboardingPage from '../features/vendor/pages/StripeOnboardingPage';
import OnboardingCompletePage from '../features/vendor/pages/OnboardingCompletePage';
import VendorPendingPage from '../features/vendor/pages/VendorPendingPage';
import VendorRejectedPage from '../features/vendor/pages/VendorRejectedPage';

import VerifyEmailPage from '../features/auth/pages/VerifyEmailPage';
import CheckYourEmailPage from '../features/auth/pages/CheckYourEmailPage';

import ForbiddenPage from '../features/pages/ForbiddenPage';

import CatalogPage from '../features/catalog/pages/CatalogPage';
import ProductDetailPage from '../features/catalog/pages/ProductDetailPage';
import CartPage from '../features/cart/pages/CartPage';

export const router = createBrowserRouter([
    /* ══════════════════════════════════════════════════════
     *  PUBLIC  (top bar + header + footer, no auth required)
     * ══════════════════════════════════════════════════════ */
    {
        element: <PublicLayout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: 'category/:slug', element: <CatalogPage /> },
            { path: 'search', element: <CatalogPage /> },
            { path: 'collections', element: <CatalogPage /> },
            { path: 'products/:slug', element: <ProductDetailPage /> },
            { path: 'cart', element: <CartPage /> },
            { path: 'collections', element: <Navigate to="/search?sort=featured" replace /> },

            /* ── Guest-only pages (redirect if already signed in) ── */
            {
                element: <GuestRoute />,
                children: [
                    { path: 'login', element: <LoginPage /> },
                    { path: 'register', element: <RegisterPage /> },
                    { path: 'forgot-password', element: <ForgotPasswordPage /> },
                    { path: 'reset-password/:token', element: <ResetPasswordPage /> },
                ],
            },

            /* ── Email verification (open — unverified users may need it) ── */
            { path: 'verify-email/:token?', element: <VerifyEmailPage /> },
            { path: 'verify-email/sent', element: <CheckYourEmailPage /> },

            /* ── Vendor onboarding funnel (public) ───────── */
            {
                path: 'sell',
                children: [
                    { index: true, element: <SellLandingPage /> },
                    { path: 'register', element: <VendorRegisterPage /> },
                    { path: 'onboarding', element: <StripeOnboardingPage /> },
                    { path: 'onboarding/complete', element: <OnboardingCompletePage /> },
                    { path: 'rejected', element: <VendorRejectedPage /> },
                ],
            },

            /* ── Backwards-compat redirects ────────────────── */
            { path: 'sell/pending', element: <Navigate to="/vendor/pending" replace /> },

            /* ── Checkout (auth-gated later) ───────────────── */
            { path: 'checkout/address', element: <Placeholder title="Checkout — Address" /> },
            { path: 'checkout/payment', element: <Placeholder title="Checkout — Payment" /> },
            { path: 'checkout/success', element: <Placeholder title="Order Confirmation" /> },

            /* ── Error / utility ───────────────────────────── */
            { path: '403', element: <ForbiddenPage /> },
            { path: '500', element: <Placeholder title="500 — Server Error" /> },
            { path: '*', element: <ForbiddenPage /> },
        ],
    },

    /* ══════════════════════════════════════════════════════
     *  VENDOR STATUS PAGES
     *  Auth + vendor role required, but NOT approved status.
     *  Rendered inside PublicLayout so no dashboard sidebar.
     * ══════════════════════════════════════════════════════ */
    {
        element: <PublicLayout />,
        children: [
            {
                element: <ProtectedRoute context="user" roles={['vendor']} />,
                children: [
                    { path: 'vendor/pending', element: <VendorPendingPage /> },
                    { path: 'vendor/rejected', element: <VendorRejectedPage /> },
                ],
            },
        ],
    },

    /* ══════════════════════════════════════════════════════
     *  CUSTOMER ACCOUNT
     * ══════════════════════════════════════════════════════ */
    {
        element: <ProtectedRoute context="user" />,
        children: [
            {
                path: 'account',
                element: <CustomerLayout />,
                children: [
                    { index: true, element: <Placeholder title="My Profile" /> },
                    { path: 'orders', element: <Placeholder title="My Orders" /> },
                    { path: 'orders/:id', element: <Placeholder title="Order Detail" /> },
                    { path: 'addresses', element: <Placeholder title="My Addresses" /> },
                    { path: 'security', element: <Placeholder title="Change Password" /> },
                ],
            },
        ],
    },

    /* ══════════════════════════════════════════════════════
     *  VENDOR DASHBOARD  (approved-only)
     * ══════════════════════════════════════════════════════ */
    {
        element: <ProtectedRoute context="user" roles={['vendor']} requireVendorApproved />,
        children: [
            {
                path: 'vendor',
                element: <VendorLayout />,
                children: [
                    { index: true, element: <Navigate to="dashboard" replace /> },
                    { path: 'dashboard', element: <Placeholder title="Vendor Dashboard" /> },
                    { path: 'products', element: <Placeholder title="Product List" /> },
                    { path: 'products/new', element: <Placeholder title="Add Product" /> },
                    { path: 'products/:id/edit', element: <Placeholder title="Edit Product" /> },
                    { path: 'orders', element: <Placeholder title="Vendor Orders" /> },
                    { path: 'orders/:itemId', element: <Placeholder title="Vendor Order Detail" /> },
                    { path: 'settings/profile', element: <Placeholder title="Vendor Profile Settings" /> },
                    { path: 'settings/payouts', element: <Placeholder title="Payout Settings" /> },
                ],
            },
        ],
    },

    /* ══════════════════════════════════════════════════════
     *  ADMIN  (fully separate auth context)
     * ══════════════════════════════════════════════════════ */
    {
        element: <GuestRoute context="admin" />,
        children: [
            { path: 'admin/login', element: <AdminLoginPage /> },
        ],
    },
    {
        element: <ProtectedRoute context="admin" />,
        children: [
            {
                path: 'admin',
                element: <AdminLayout />,
                children: [
                    { index: true, element: <Navigate to="dashboard" replace /> },
                    { path: 'dashboard', element: <Placeholder title="Admin Dashboard" /> },
                    { path: 'vendors', element: <Placeholder title="All Vendors" /> },
                    { path: 'vendors/:id', element: <Placeholder title="Vendor Detail" /> },
                    { path: 'products', element: <Placeholder title="Product Moderation" /> },
                    { path: 'products/:id', element: <Placeholder title="Product Detail" /> },
                    { path: 'orders', element: <Placeholder title="All Orders" /> },
                    { path: 'orders/:id', element: <Placeholder title="Order Detail" /> },
                    { path: 'categories', element: <Placeholder title="Category Management" /> },
                    { path: 'activities', element: <Placeholder title="Activity Log" /> },
                ],
            },
        ],
    },
]);