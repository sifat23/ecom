import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    actorType: localStorage.getItem('actorType') || 'user', // 'user' or 'admin'
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, token, actorType } = action.payload;
            state.user = user;
            state.token = token;
            state.isAuthenticated = true;
            state.actorType = actorType || 'user';
            localStorage.setItem('token', token);
            localStorage.setItem('actorType', state.actorType);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.actorType = 'user';
            localStorage.removeItem('token');
            localStorage.removeItem('actorType');
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;