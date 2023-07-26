import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../redux-toolkit/userSlice';
import tradeReducer from '../redux-toolkit/tradesSlice';
import accountReducer from '../redux-toolkit/accountsSlice';


const store = configureStore({
    reducer: {
        accounts: accountReducer,
        auth: authReducer,
        trades: tradeReducer,
    },
});

export default store;
