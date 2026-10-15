// frontend/src/features/vendor/vendorApi.js
import { apiSlice } from '../../store/api/apiSlice';

export const vendorApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        registerVendor: builder.mutation({
            query: (body) => ({ url: '/vendors/register', method: 'POST', body }),
            invalidatesTags: ['Vendor'],
        }),
        getMyVendor: builder.query({
            query: () => '/vendors/me',
            providesTags: ['Vendor'],
        }),
        createOnboardingLink: builder.mutation({
            query: () => ({ url: '/vendors/stripe-onboarding-link', method: 'POST' }),
        }),
        resubmitVendor: builder.mutation({
            query: (body) => ({ url: '/vendors/resubmit', method: 'POST', body }),
            invalidatesTags: ['Vendor'],
        }),
    }),
});

export const {
    useRegisterVendorMutation,
    useGetMyVendorQuery,
    useCreateOnboardingLinkMutation,
    useResubmitVendorMutation,
} = vendorApi;