import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../redux-toolkit/userSlice';
import messagesSlice from '../redux-toolkit/messagesSlice';
import darkModeReducer from '../redux-toolkit/darkModeSlice';
import languagesReducer from '../redux-toolkit/languagesSlice';
import tradeReducer from '../redux-toolkit/tradeSlice';
import loadingReducer from '../redux-toolkit/loadingSlice';
import editTradeFormReducer from "../redux-toolkit/editTradeFormSlice";


const store = configureStore({
        reducer: {
                auth: authReducer,
                messages: messagesSlice,
                darkMode: darkModeReducer,
                languages: languagesReducer,
                currentTrade: tradeReducer,
                loading: loadingReducer,
                editMode: editTradeFormReducer
        },
});

export default store;
