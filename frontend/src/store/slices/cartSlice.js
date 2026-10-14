// src/store/slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'cart',
    initialState: { items: [], isOpen: false },
    reducers: {
        setCart: (state, action) => { state.items = action.payload; },
        toggleCart: (state) => { state.isOpen = !state.isOpen; },
    },
});
export const { setCart, toggleCart } = cartSlice.actions;
export default cartSlice.reducer;