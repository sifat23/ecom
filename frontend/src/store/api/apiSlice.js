import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { tokenRefreshed, loggedOut } from '../slices/authSlice';

const rawBaseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || '/api',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.accessToken;
        if (token) headers.set('Authorization', `Bearer ${token}`);
        return headers;
    },
});

/**
 * Reauth wrapper — Phase 1 will implement the actual refresh call.
 * Wired now so every endpoint added later inherits it for free.
 */
const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await rawBaseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {
        const refreshed = await rawBaseQuery(
            { url: '/auth/refresh', method: 'POST' },
            api,
            extraOptions
        );

        if (refreshed.data?.accessToken) {
            api.dispatch(tokenRefreshed({ accessToken: refreshed.data.accessToken }));
            result = await rawBaseQuery(args, api, extraOptions);
        } else {
            api.dispatch(loggedOut());
        }
    }

    return result;
};

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Product', 'Category', 'Cart', 'Order', 'Vendor', 'User', 'Activity'],
    endpoints: () => ({}),
});

// Skeleton endpoint — proves the wire end-to-end in Phase 0
export const healthApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getHealth: builder.query({
            query: () => '/health',
        }),
    }),
});

export const { useGetHealthQuery } = healthApi;