import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,          // { id, email, firstName, role, ... }
    accessToken: null,
    isAuthenticated: false,
    // Admin uses a completely separate auth context (Phase 1)
    admin: null,
    adminToken: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        credentialsReceived(state, action) {
            const { user, accessToken } = action.payload;
            state.user = user;
            state.accessToken = accessToken;
            state.isAuthenticated = true;
        },
        adminCredentialsReceived(state, action) {
            const { admin, accessToken } = action.payload;
            state.admin = admin;
            state.adminToken = accessToken;
        },
        tokenRefreshed(state, action) {
            state.accessToken = action.payload.accessToken;
        },
        loggedOut(state) {
            Object.assign(state, initialState);
        },
    },
});

export const {
    credentialsReceived,
    adminCredentialsReceived,
    tokenRefreshed,
    loggedOut,
} = authSlice.actions;

export default authSlice.reducer;