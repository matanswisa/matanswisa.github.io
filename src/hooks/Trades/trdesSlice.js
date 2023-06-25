import { createSlice } from '@reduxjs/toolkit';

export const tradesSlice = createSlice({
    name: 'trades',
    initialState: [],
    reducers: {
        addTrade: (state, action) => {
            const {
                _id,
                entryDate,
                symbol,
                status,
                netROI,
                longShort,
                contracts,
                entryPrice,
                stopPrice,
                exitPrice,
                duration,
                commission,
                netPnL,
                image,
                comments
            } = action.payload;

            const trade = {
                id: _id,
                entryDate,
                symbol,
                status,
                netROI,
                longShort,
                contracts,
                entryPrice,
                stopPrice,
                exitPrice,
                duration,
                commission,
                netPnL,
                image,
                comments
            };

            return [...state, trade];
        },
    },
});

// This is for dispatch
export const { addTrade } = tradesSlice.actions;

// This is for configureStore
export default tradesSlice.reducer;
