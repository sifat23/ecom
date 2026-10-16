import { apiSlice } from '../../store/api/apiSlice';

export const vendorApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMyVendor: builder.query({
            query: () => '/vendors/me',
            providesTags: ['Vendor'],
        }),

        saveLegalDraft: builder.mutation({
            query: (body) => ({ url: '/vendors/legal/draft', method: 'POST', body }),
        }),

        /* Step 1 — draft save (auto, on blur / on demand). Doesn't
         * invalidate the tag so a background refetch can't clobber
         * the form while it's being edited. */
        saveStoreDraft: builder.mutation({
            query: (body) => ({
                url: '/vendors/store/draft',
                method: 'POST',
                body,
            }),
        }),

        /* Step 1 — explicit "Save & Continue". Invalidates so the
         * pending page picks up the new state. */
        submitStoreStep: builder.mutation({
            query: (body) => ({
                url: '/vendors/store/submit',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Vendor'],
        }),

        submitLegalStep: builder.mutation({
            query: (body) => ({ url: '/vendors/legal/submit', method: 'POST', body }),
            invalidatesTags: ['Vendor'],
        }),

        createOnboardingLink: builder.mutation({
            query: () => ({ url: '/vendors/stripe-onboarding-link', method: 'POST' }),
        }),

        saveContactDraft: builder.mutation({
            query: (body) => ({ url: '/vendors/contact/draft', method: 'POST', body }),
        }),

        submitContactStep: builder.mutation({
            query: (body) => ({ url: '/vendors/contact/submit', method: 'POST', body }),
            invalidatesTags: ['Vendor'],
        }),

        saveBankDraft: builder.mutation({
            query: (body) => ({ url: '/vendors/bank/draft', method: 'POST', body }),
        }),

        submitBankStep: builder.mutation({
            query: (body) => ({ url: '/vendors/bank/submit', method: 'POST', body }),
            invalidatesTags: ['Vendor'],
        }),


        uploadVendorDocument: builder.mutation({
            query: ({ file, documentType }) => {
                const fd = new FormData();
                fd.append('file', file);
                if (documentType) fd.append('documentType', documentType);
                return {
                    url: '/vendors/documents/upload',
                    method: 'POST',
                    body: fd,
                    formData: true,
                };
            },
            invalidatesTags: ['Vendor'],
        }),

        deleteVendorDocument: builder.mutation({
            query: (docId) => ({
                url: `/vendors/documents/${docId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Vendor'],
        }),

        submitFullApplication: builder.mutation({
            query: () => ({
                url: '/vendors/application/submit',
                method: 'POST',
            }),
            invalidatesTags: ['Vendor'],
        }),

    }),
});

export const {
    useGetMyVendorQuery,
    useSaveStoreDraftMutation,
    useSubmitStoreStepMutation,
    useSaveLegalDraftMutation,
    useSubmitLegalStepMutation,
    useSaveContactDraftMutation,
    useSubmitContactStepMutation,
    useSaveBankDraftMutation,
    useSubmitBankStepMutation,
    useUploadVendorDocumentMutation,
    useDeleteVendorDocumentMutation,
    useSubmitFullApplicationMutation,
    useCreateOnboardingLinkMutation,
} = vendorApi;