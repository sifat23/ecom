import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        ui: uiReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefault) => getDefault().concat(apiSlice.middleware),
    devTools: import.meta.env.DEV,
});