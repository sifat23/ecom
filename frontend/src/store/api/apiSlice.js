import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
    accessTokenRefreshed,
    adminAccessTokenRefreshed,
    userSessionCleared,
    adminSessionCleared,
} from '../slices/authSlice';

const rawBaseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || '/api',
    credentials: 'include',
    prepareHeaders: (headers, { getState, endpoint }) => {
        const state = getState().auth;
        // Admin endpoints use the admin token; everything else uses the user token.
        const isAdminCall = endpoint?.startsWith('admin') || state.__adminRequest;
        const token = isAdminCall ? state.adminToken : state.accessToken;
        if (token) headers.set('Authorization', `Bearer ${token}`);
        return headers;
    },
});

/**
 * Wraps rawBaseQuery to auto-refresh the correct token on 401.
 * Prefers the admin refresh path if the failing request was admin-scoped.
 */
export const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await rawBaseQuery(args, api, extraOptions);

    if (result.error?.status !== 401) return result;

    const url = typeof args === 'string' ? args : args?.url ?? '';
    const isAdmin = url.startsWith('/admin/');

    const refreshUrl = isAdmin ? '/admin/auth/refresh' : '/auth/refresh';

    const refreshed = await rawBaseQuery(
        { url: refreshUrl, method: 'POST' },
        api,
        extraOptions
    );

    if (refreshed.data?.data?.accessToken) {
        const token = refreshed.data.data.accessToken;
        if (isAdmin) {
            api.dispatch(adminAccessTokenRefreshed(token));
        } else {
            api.dispatch(accessTokenRefreshed(token));
        }
        // Retry the original request.
        result = await rawBaseQuery(args, api, extraOptions);
    } else {
        if (isAdmin) api.dispatch(adminSessionCleared());
        else api.dispatch(userSessionCleared());
    }

    return result;
};

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Product', 'Category', 'Cart', 'Order', 'Vendor', 'User', 'Activity', 'Me'],
    endpoints: () => ({}),
});