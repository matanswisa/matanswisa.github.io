import { createSlice } from '@reduxjs/toolkit';

export const tradesSlice = createSlice({
    name: 'trades',
    initialState: [],
    reducers: {
        setTrades: (state, action) => {
            const newTradesList = action.payload;
            return newTradesList;
        },
        addTrade: (state, action) => {
            const trade = {
                ...action.payload,
            };
            state.push(trade);
        },
        removeTrade: (state, action) => {
            const tradeId = action.payload;
            const index = state.findIndex(trade => trade.id === tradeId);
            if (index !== -1) {
                state.splice(index, 1);
            }
        },
        updateTrade: (state, action) => {
            const updatedTrade = action.payload;
            const index = state.findIndex(trade => trade.id === updatedTrade.id);
            if (index !== -1) {
                state[index] = updatedTrade;
            }
        },
    },
});

export const { setTrades, addTrade, removeTrade, updateTrade } = tradesSlice.actions;

export const getTradesList = (state) => state.trades;

export default tradesSlice.reducer;

// Function to update trades list
export const updateTradesList = (newTradesList) => (dispatch) => {
    dispatch(setTrades(newTradesList));
};
