import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../redux-toolkit/userSlice';
import messagesSlice from '../redux-toolkit/messagesSlice';
import darkModeReducer from '../redux-toolkit/darkModeSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        messages: messagesSlice,
        darkMode: darkModeReducer,
    },
});

export default store;
