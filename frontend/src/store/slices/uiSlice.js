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
            reducer(state, action) { state.toasts.push(action.payload); },
            prepare({ type = 'info', message, timeout = 4000 }) {
                return { payload: { id: nanoid(), type, message, timeout } };
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