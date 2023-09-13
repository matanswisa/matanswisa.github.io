
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    trade: null,
};

const tradeSlice = createSlice({
    name: 'trade',
    initialState,
    reducers: {
        setTrade(state, action) {

            state.trade = action.payload;
        },
    },
});

export const { setTrade } = tradeSlice.actions;

export const selectTrade = (state) => state.currentTrade.trade;

export default tradeSlice.reducer;