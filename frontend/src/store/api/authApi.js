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
                } finally {
                    dispatch(bootstrapComplete());
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
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useLogoutMutation,
    useBootstrapSessionMutation,
    useGetMeQuery,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useAdminLoginMutation,
    useAdminLogoutMutation,
    useAdminBootstrapMutation,
    useVerifyEmailMutation,
    useResendVerificationMutation,
} = authApi;