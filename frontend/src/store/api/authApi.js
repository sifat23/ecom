import { apiSlice } from './apiSlice';
import {
    userSessionReceived,
    userSessionCleared,
    adminSessionReceived,
    adminSessionCleared,
    bootstrapComplete,
} from '../slices/authSlice';

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        /* ── USER ───────────────────────────────────── */

        register: builder.mutation({
            query: (body) => ({ url: '/auth/register', method: 'POST', body }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(userSessionReceived(data.data));
                } catch { /* handled in component */ }
            },
        }),

        login: builder.mutation({
            query: (body) => ({ url: '/auth/login', method: 'POST', body }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(userSessionReceived(data.data));
                } catch { /* handled in component */ }
            },
        }),

        googleAuth: builder.mutation({
            query: (body) => ({ url: '/auth/google', method: 'POST', body }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(userSessionReceived(data.data));
                } catch { /* handled in component */ }
            },
        }),

        logout: builder.mutation({
            query: () => ({ url: '/auth/logout', method: 'POST' }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                } finally {
                    dispatch(userSessionCleared());
                }
            },
        }),

        verifyEmail: builder.mutation({
            query: (body) => ({ url: '/auth/verify-email', method: 'POST', body }),
        }),

        resendVerification: builder.mutation({
            query: (body) => ({ url: '/auth/resend-verification', method: 'POST', body }),
        }),

        /** Silent refresh for app boot — no component cares about failure. */
        bootstrapSession: builder.mutation({
            query: () => ({ url: '/auth/refresh', method: 'POST' }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(userSessionReceived(data.data));
                } catch {
                    dispatch(userSessionCleared());
                }
            },
        }),

        getMe: builder.query({
            query: () => '/auth/me',
            providesTags: ['Me'],
        }),

        /* ── PASSWORD RESET ─────────────────────────── */

        forgotPassword: builder.mutation({
            query: (body) => ({ url: '/auth/forgot-password', method: 'POST', body }),
        }),

        resetPassword: builder.mutation({
            query: (body) => ({ url: '/auth/reset-password', method: 'POST', body }),
        }),

        /* ── ADMIN ──────────────────────────────────── */

        adminLogin: builder.mutation({
            query: (body) => ({ url: '/admin/auth/login', method: 'POST', body }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(adminSessionReceived(data.data));
                } catch { /* handled in component */ }
            },
        }),

        adminLogout: builder.mutation({
            query: () => ({ url: '/admin/auth/logout', method: 'POST' }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try { await queryFulfilled; } finally { dispatch(adminSessionCleared()); }
            },
        }),

        adminBootstrap: builder.mutation({
            query: () => ({ url: '/admin/auth/refresh', method: 'POST' }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(adminSessionReceived(data.data));
                } catch {
                    dispatch(adminSessionCleared());
                }
            },
        }),

        adminForgotPassword: builder.mutation({
            query: (body) => ({ url: '/admin/auth/forgot-password', method: 'POST', body }),
        }),

        adminResetPassword: builder.mutation({
            query: (body) => ({ url: '/admin/auth/reset-password', method: 'POST', body }),
        }),

        /* ── ADMIN VENDOR MANAGEMENT ─────────────────── */

        getAdminVendors: builder.query({
            query: ({ status = 'pending', search = '', page = 1 } = {}) => ({
                url: `/admin/vendors?status=${encodeURIComponent(status)}&search=${encodeURIComponent(search)}&page=${page}`,
            }),
            providesTags: ['AdminVendors'],
        }),

        getAdminVendorDetail: builder.query({
            query: (id) => `/admin/vendors/${id}`,
            providesTags: (_res, _err, id) => [{ type: 'AdminVendors', id }],
        }),

        approveAdminVendor: builder.mutation({
            query: (id) => ({
                url: `/admin/vendors/${id}/approve`,
                method: 'POST',
            }),
            invalidatesTags: ['AdminVendors', 'Vendor'],
        }),

        rejectAdminVendor: builder.mutation({
            query: ({ id, reason }) => ({
                url: `/admin/vendors/${id}/reject`,
                method: 'POST',
                body: { reason },
            }),
            invalidatesTags: ['AdminVendors', 'Vendor'],
        }),

        getAdminVendorActivities: builder.query({
            query: (limit = 30) => `/admin/vendors/activities?limit=${limit}`,
            providesTags: ['AdminVendors'],
        }),
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useGoogleAuthMutation,
    useLogoutMutation,
    useBootstrapSessionMutation,
    useGetMeQuery,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useAdminLoginMutation,
    useAdminLogoutMutation,
    useAdminBootstrapMutation,
    useAdminForgotPasswordMutation,
    useAdminResetPasswordMutation,
    useGetAdminVendorsQuery,
    useGetAdminVendorDetailQuery,
    useApproveAdminVendorMutation,
    useRejectAdminVendorMutation,
    useGetAdminVendorActivitiesQuery,
    useVerifyEmailMutation,
    useResendVerificationMutation,
} = authApi;