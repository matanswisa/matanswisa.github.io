
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    hebrew: false,
    idx: 0,
};

const languagesSlice = createSlice({
    name: 'hebrew',
    initialState,
    reducers: {
        togglelanguage(state, action) {
            if(state.hebrew === true){
                state.idx -=1;
            }
            else{
                state.idx+=1;
            }
            state.hebrew = !state.hebrew;
        }
    },
});

export const { togglelanguage } = languagesSlice.actions;

export const selectlanguage = (state) => state.languages.hebrew;

export const selectidx = (state) => state.languages.idx;


export default languagesSlice.reducer;