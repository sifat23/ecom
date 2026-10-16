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
import AdminForgotPasswordPage from '../features/auth/pages/AdminForgotPasswordPage';
import AdminResetPasswordPage from '../features/auth/pages/AdminResetPasswordPage';
import AdminDashboardPage from '../features/admin/pages/AdminDashboardPage';
import AdminVendorsPage from '../features/admin/pages/AdminVendorsPage';
import AdminSubpage from '../features/admin/pages/AdminSubpage';

import SellLandingPage from '../features/vendor/pages/SellLandingPage';
import VendorRegisterPage from '../features/vendor/pages/VendorRegisterPage';
import VendorLoginPage from '../features/vendor/pages/VendorLoginPage';
import VendorRegisterAccountPage from '../features/vendor/pages/VendorRegisterAccountPage';
import VendorForgotPasswordPage from '../features/vendor/pages/VendorForgotPasswordPage';
import VendorResetPasswordPage from '../features/vendor/pages/VendorResetPasswordPage';
import StripeOnboardingPage from '../features/vendor/pages/StripeOnboardingPage';
import OnboardingCompletePage from '../features/vendor/pages/OnboardingCompletePage';
import VendorPendingPage from '../features/vendor/pages/VendorPendingPage';
import VendorRejectedPage from '../features/vendor/pages/VendorRejectedPage';

import VerifyEmailPage from '../features/auth/pages/VerifyEmailPage';
import CheckYourEmailPage from '../features/auth/pages/CheckYourEmailPage';

import ForbiddenPage from '../features/pages/ForbiddenPage';
import NotFoundPage from '../features/pages/NotFoundPage';

import CatalogPage from '../features/catalog/pages/CatalogPage';
import ProductDetailPage from '../features/catalog/pages/ProductDetailPage';
import CartPage from '../features/cart/pages/CartPage';

import VendorSetupPage from '../features/vendor/pages/VendorSetupPage';

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

            /* ── Customer Guest-only pages (redirect if already signed in) ── */
            {
                element: <GuestRoute />,
                children: [
                    { path: 'login', element: <LoginPage /> },
                    { path: 'register', element: <RegisterPage /> },
                    { path: 'forgot-password', element: <ForgotPasswordPage /> },
                    { path: 'reset-password/:token', element: <ResetPasswordPage /> },
                ],
            },

            /* ── Vendor Guest-only pages (redirect if already signed in) ── */
            {
                element: <GuestRoute />,
                children: [
                    { path: 'vendor/login', element: <VendorLoginPage /> },
                    { path: 'vendor/register', element: <VendorRegisterAccountPage /> },
                    { path: 'vendor/forgot-password', element: <VendorForgotPasswordPage /> },
                    { path: 'vendor/reset-password/:token', element: <VendorResetPasswordPage /> },
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

            {
                element: <ProtectedRoute context="user" roles={['vendor']} />,
                children: [
                    { path: 'vendor/setup', element: <VendorSetupPage /> },
                    { path: 'vendor/pending', element: <VendorPendingPage /> },
                    { path: 'vendor/rejected', element: <VendorRejectedPage /> },
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
            { path: '404', element: <NotFoundPage /> },
            { path: '500', element: <Placeholder title="500 — Server Error" /> },
            { path: '*', element: <NotFoundPage /> },
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
            { path: 'admin/forgot-password', element: <AdminForgotPasswordPage /> },
            { path: 'admin/reset-password/:token', element: <AdminResetPasswordPage /> },
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
                    { path: 'dashboard', element: <AdminDashboardPage /> },
                    {
                        path: 'analytics',
                        element: (
                            <AdminSubpage
                                title="Analytics & GMV"
                                subtitle="Gross merchandise trajectory, average order value, and trailing platform commissions."
                                icon="trending_up"
                                badge="Financial Intelligence"
                                stats={[
                                    { label: 'Trailing GMV', value: '$248,920', trend: '+14.8% vs last month', icon: 'payments' },
                                    { label: 'Platform Margin', value: '20.0%', trend: 'Contracted rate', icon: 'percent' },
                                    { label: 'Average Basket', value: '$174.30', trend: '+4.2% AOV', icon: 'shopping_bag' },
                                    { label: 'Conversion', value: '3.42%', trend: '+0.6% storefront', icon: 'query_stats' },
                                ]}
                            />
                        ),
                    },
                    {
                        path: 'orders',
                        element: (
                            <AdminSubpage
                                title="Orders & Fulfillment"
                                subtitle="Global boutique logistics routing, customs declarations, and dispatch SLAs."
                                icon="inventory_2"
                                badge="Logistics Node"
                                stats={[
                                    { label: 'Active Dispatches', value: '1,428', trend: '98.4% on-time SLA', icon: 'local_shipping' },
                                    { label: 'Customs Queue', value: '300', trend: 'Frankfurt / NYC nodes', icon: 'flight_takeoff' },
                                    { label: 'Requires Action', value: '38', trend: 'Address validation', icon: 'warning' },
                                    { label: 'Delivered (30d)', value: '6,840', trend: '100% verified', icon: 'verified' },
                                ]}
                            />
                        ),
                    },
                    { path: 'orders/:id', element: <AdminSubpage title="Order Detail" subtitle="Order line items and fulfillment history." icon="inventory_2" /> },
                    {
                        path: 'products',
                        element: (
                            <AdminSubpage
                                title="Catalog & Inventory"
                                subtitle="Artisan product listings, SKU taxonomy, and quality governance."
                                icon="shelves"
                                badge="Artisan Catalog"
                                stats={[
                                    { label: 'Active SKUs', value: '842', trend: '+18 this week', icon: 'inventory' },
                                    { label: 'Low Stock Items', value: '14', trend: 'Reorder triggered', icon: 'production_quantity_limits' },
                                    { label: 'Pending Review', value: '6', trend: 'Awaiting moderation', icon: 'pending_actions' },
                                    { label: 'Guild Audited', value: '100%', trend: 'Fair trade compliant', icon: 'eco' },
                                ]}
                            />
                        ),
                    },
                    { path: 'products/:id', element: <AdminSubpage title="Product Detail" subtitle="Product specifications and inventory status." icon="shelves" /> },
                    {
                        path: 'customers',
                        element: (
                            <AdminSubpage
                                title="Customers & Patrons"
                                subtitle="Boutique member registry, concierge requests, and customer engagement metrics."
                                icon="groups"
                                badge="Patron Relations"
                                stats={[
                                    { label: 'Total Patrons', value: '18,420', trend: '+12.4% new signups', icon: 'person_add' },
                                    { label: 'Repeat Rate', value: '41.2%', trend: 'High retention cohort', icon: 'repeat' },
                                    { label: 'VIP Guild Members', value: '2,150', trend: 'Concierge tier', icon: 'loyalty' },
                                    { label: 'Satisfaction', value: '4.9 / 5', trend: 'Over 12k reviews', icon: 'grade' },
                                ]}
                            />
                        ),
                    },
                    {
                        path: 'vendors',
                        element: <AdminVendorsPage />,
                    },
                    {
                        path: 'vendors/:id',
                        element: <AdminVendorsPage />,
                    },
                    {
                        path: 'payouts',
                        element: (
                            <AdminSubpage
                                title="Payouts & Escrow"
                                subtitle="Stripe Connect split payouts, ledger audits, and automated settlement batches."
                                icon="payments"
                                badge="Financial Settlement"
                                stats={[
                                    { label: 'Settlement Escrow', value: '$199,136', trend: 'Batch in 4 hours', icon: 'account_balance' },
                                    { label: 'Processed (MTD)', value: '$840,290', trend: 'Zero chargebacks', icon: 'check_circle' },
                                    { label: 'Commission Retained', value: '$49,784', trend: '20% platform share', icon: 'savings' },
                                    { label: 'Artisan Accounts', value: '142', trend: '100% onboarded', icon: 'hub' },
                                ]}
                            />
                        ),
                    },
                    {
                        path: 'security',
                        element: (
                            <AdminSubpage
                                title="Security & Telemetry"
                                subtitle="Cryptographic node verification, authenticated sessions, and system audit trails."
                                icon="shield"
                                badge="Operations Node"
                                stats={[
                                    { label: 'Node Latency', value: '14ms', trend: 'EU-North-1 Nominal', icon: 'speed' },
                                    { label: 'Active Sessions', value: '3', trend: 'Encrypted admin tokens', icon: 'vpn_key' },
                                    { label: 'Failed Attempts', value: '0', trend: 'Rate limiting active', icon: 'gpp_good' },
                                    { label: 'Audit Integrity', value: '100%', trend: 'Signed activity log', icon: 'security' },
                                ]}
                            />
                        ),
                    },
                    {
                        path: 'settings',
                        element: (
                            <AdminSubpage
                                title="Settings & ESG"
                                subtitle="Platform parameters, environmental impact scoring, and console preferences."
                                icon="tune"
                                badge="Platform Config"
                                stats={[
                                    { label: 'Carbon Offset', value: '100%', trend: 'Boutique carbon neutral', icon: 'forest' },
                                    { label: 'Eco Packaging', value: '98.5%', trend: 'Recyclable linen & box', icon: 'recycling' },
                                    { label: 'API Version', value: 'v2.4.1', trend: 'Latest stable build', icon: 'code' },
                                    { label: 'Platform Status', value: 'Optimal', trend: 'All microservices up', icon: 'check_circle' },
                                ]}
                            />
                        ),
                    },
                    { path: 'categories', element: <AdminSubpage title="Categories Management" subtitle="Catalog taxonomy and tree classification." icon="category" /> },
                    { path: 'activities', element: <AdminSubpage title="Activity Log" subtitle="Audit trail and security events." icon="history" /> },
                ],
            },
        ],
    },
]);