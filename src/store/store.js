import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../redux-toolkit/userSlice';
import messagesSlice from '../redux-toolkit/messagesSlice';
import darkModeReducer from '../redux-toolkit/darkModeSlice';
import languagesReducer from '../redux-toolkit/languagesSlice';
const store = configureStore({
    reducer: {
        auth: authReducer,
        messages: messagesSlice,
        darkMode: darkModeReducer,
        languages: languagesReducer,
    },
});

export default store;
