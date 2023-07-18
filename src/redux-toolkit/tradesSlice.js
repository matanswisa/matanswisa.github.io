import { createSlice } from '@reduxjs/toolkit';

export const tradesSlice = createSlice({
    name: 'trades',
    initialState: {
        trades: []
    },
    reducers: {
        setTrades: (state, action) => {

            state.trades = action.payload;
        },
        addTrade: (state, action) => {
            const trade = {
                ...action.payload,
            };
            state.trades.push(trade);
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

export const getTrades = (state) => state.trades.trades;


// Function to update trades list
export const updateTradesList = (newTradesList) => (dispatch) => {
    dispatch(setTrades(newTradesList));
};

export default tradesSlice.reducer;