
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading: false,
};

const LoadingSlice = createSlice({
    name: 'Loading',
    initialState,
    reducers: {
        toggleLoading(state, action) {
            state.loading = !state.loading;
        }
    },
});

export const { toggleLoading } = LoadingSlice.actions;

export const selectLoading = (state) => state.loading.loading;


export default LoadingSlice.reducer;