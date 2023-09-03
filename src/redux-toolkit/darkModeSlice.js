
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    darkmode: false,
};

const darkModeSlice = createSlice({
    name: 'darkmode',
    initialState,
    reducers: {
        toggleDarkMode(state, action) {
            state.darkmode = !state.darkmode;
        }
    },
});

export const { toggleDarkMode } = darkModeSlice.actions;
export const selectDarkMode = (state) => state.darkmode;


export default darkModeSlice.reducer;