import { createBrowserRouter, Navigate } from 'react-router-dom';

import PublicLayout   from '../layouts/PublicLayout';
import CustomerLayout from '../layouts/CustomerLayout';
import VendorLayout   from '../layouts/VendorLayout';
import AdminLayout    from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';

import HomePage    from '../features/pages/HomePage';
import Placeholder from '../features/pages/Placeholder';

import LoginPage          from '../features/auth/pages/LoginPage';
import RegisterPage       from '../features/auth/pages/RegisterPage';
import ForgotPasswordPage from '../features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage  from '../features/auth/pages/ResetPasswordPage';
import AdminLoginPage     from '../features/auth/pages/AdminLoginPage';

import SellLandingPage      from '../features/vendor/pages/SellLandingPage';
import VendorRegisterPage   from '../features/vendor/pages/VendorRegisterPage';
import StripeOnboardingPage from '../features/vendor/pages/StripeOnboardingPage';
import OnboardingCompletePage from '../features/vendor/pages/OnboardingCompletePage';
import VendorPendingPage    from '../features/vendor/pages/VendorPendingPage';
import VendorRejectedPage   from '../features/vendor/pages/VendorRejectedPage';

import VerifyEmailPage   from '../features/auth/pages/VerifyEmailPage';
import CheckYourEmailPage from '../features/auth/pages/CheckYourEmailPage';

import ForbiddenPage from '../features/pages/ForbiddenPage';

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

            { path: 'login',                      element: <LoginPage /> },
            { path: 'register',                   element: <RegisterPage /> },
            { path: 'forgot-password',            element: <ForgotPasswordPage /> },
            { path: 'reset-password/:token',      element: <ResetPasswordPage /> },

            { path: 'verify-email/:token?', element: <VerifyEmailPage /> },
            { path: 'verify-email/sent',    element: <CheckYourEmailPage /> },

            {
                path: 'sell',
                children: [
                    { index: true,             element: <SellLandingPage /> },
                    { path: 'register',        element: <VendorRegisterPage /> },
                    { path: 'onboarding',      element: <StripeOnboardingPage /> },
                    { path: 'onboarding/complete', element: <OnboardingCompletePage /> },
                    { path: 'pending',         element: <VendorPendingPage /> },
                    { path: 'rejected',        element: <VendorRejectedPage /> },
                ],
            },

            // Checkout is auth-gated later; placeholder for now
            { path: 'checkout/address',           element: <Placeholder title="Checkout — Address" /> },
            { path: 'checkout/payment',           element: <Placeholder title="Checkout — Payment" /> },
            { path: 'checkout/success',           element: <Placeholder title="Order Confirmation" /> },

            { path: '403', element: <ForbiddenPage /> },
            { path: '500', element: <Placeholder title="500 — Server Error" /> },
            { path: '*',   element: <ForbiddenPage /> },
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
    { path: 'admin/login', element: <AdminLoginPage /> },
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