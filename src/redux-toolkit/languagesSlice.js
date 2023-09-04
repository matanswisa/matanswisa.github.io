
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    hebrew: false,
};

const languagesSlice = createSlice({
    name: 'hebrew',
    initialState,
    reducers: {
        togglelanguage(state, action) {
            state.hebrew = !state.hebrew;
        }
    },
});

export const { togglelanguage } = languagesSlice.actions;

export const selectlanguage = (state) => state.languages.hebrew;

export default languagesSlice.reducer;