
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    darkmode : false,
};

const darkModeSlice = createSlice({
    name: 'darkmode',
    initialState,
    reducers: {
        
        setMode(state,action){  
            state.darkmode = action.payload;
        },

        // setToDarkMode(state, action) {
            
        //     state.darkmode = true;
        // },

    },
});

export const  {setMode} = darkModeSlice.actions;
export const selectMode = (state) => state.darkmode;


export default darkModeSlice.reducer;