import { configureStore } from '@reduxjs/toolkit';
import tradesReducers from '../hooks/Trades/trdesSlice';

export default configureStore({
    reducer: {
        trades: tradesReducers,
    },
});