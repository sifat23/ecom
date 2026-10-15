import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    // ── User context (customer / vendor) ──
    user: null,
    accessToken: null,
    isAuthenticated: false,

    // ── Admin context (fully separate) ──
    admin: null,
    adminToken: null,
    isAdminAuthenticated: false,

    // Bootstrap state — prevents ProtectedRoute from redirecting before the
    // silent /auth/refresh call on app boot has resolved.
    bootstrapped: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        userSessionReceived(state, action) {
            const { user, accessToken } = action.payload;
            state.user = user;
            state.accessToken = accessToken;
            state.isAuthenticated = Boolean(user && accessToken);
        },
        userSessionCleared(state) {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
        },
        adminSessionReceived(state, action) {
            const { admin, accessToken } = action.payload;
            state.admin = admin;
            state.adminToken = accessToken;
            state.isAdminAuthenticated = Boolean(admin && accessToken);
        },
        adminSessionCleared(state) {
            state.admin = null;
            state.adminToken = null;
            state.isAdminAuthenticated = false;
        },
        accessTokenRefreshed(state, action) {
            state.accessToken = action.payload;
        },
        adminAccessTokenRefreshed(state, action) {
            state.adminToken = action.payload;
        },
        bootstrapComplete(state) {
            state.bootstrapped = true;
        },
    },
});

export const {
    userSessionReceived,
    userSessionCleared,
    adminSessionReceived,
    adminSessionCleared,
    accessTokenRefreshed,
    adminAccessTokenRefreshed,
    bootstrapComplete,
} = authSlice.actions;

export default authSlice.reducer;