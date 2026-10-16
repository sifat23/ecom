import { createSlice, nanoid } from '@reduxjs/toolkit';

const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        toasts: [],
        cartDrawerOpen: false,
        mobileNavOpen: false,
    },
    reducers: {
        toastAdded: {
            reducer(state, action) {
                // Upsert by id — lets callers replace an existing toast in place
                // (e.g. flip a persistent "Saving…" into "Saved" without stacking).
                const idx = state.toasts.findIndex((t) => t.id === action.payload.id);
                if (idx >= 0) state.toasts[idx] = action.payload;
                else state.toasts.push(action.payload);
            },
            prepare({
                type = 'info',
                message,
                timeout = 4000,
                position = 'bottom-right',
                id,
            }) {
                return {
                    payload: {
                        id: id ?? nanoid(),
                        type,
                        message,
                        timeout,   // 0 = sticky (no auto-dismiss)
                        position,  // 'bottom-left' | 'bottom-right'
                    },
                };
            },
        },
        toastDismissed(state, action) {
            state.toasts = state.toasts.filter((t) => t.id !== action.payload);
        },
        cartDrawerToggled(state, action) {
            state.cartDrawerOpen = action.payload ?? !state.cartDrawerOpen;
        },
        mobileNavToggled(state, action) {
            state.mobileNavOpen = action.payload ?? !state.mobileNavOpen;
        },
    },
});

export const { toastAdded, toastDismissed, cartDrawerToggled, mobileNavToggled } = uiSlice.actions;
export default uiSlice.reducer;