import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux-toolkit/userSlice';
import tradeReducer from '../redux-toolkit/tradesSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        trades: tradeReducer
    },
});

export default store;
