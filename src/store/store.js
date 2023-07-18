import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from '../redux-toolkit/userSlice';
import tradeReducer from '../redux-toolkit/tradesSlice';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'trades'], // List of reducers to persist
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedTradeReducer = persistReducer(persistConfig, tradeReducer);

const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
        trades: persistedTradeReducer,
    },
});

export const persistor = persistStore(store);
export default store;
