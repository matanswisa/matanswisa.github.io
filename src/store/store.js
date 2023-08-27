import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../redux-toolkit/userSlice';
import messagesSlice from '../redux-toolkit/messagesSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        messages :messagesSlice,
    },
});

export default store;
