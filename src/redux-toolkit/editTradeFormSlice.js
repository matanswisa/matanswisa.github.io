import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isEditTrade: false,
    tradeToEdit: null
};

const editTradeFormSlice = createSlice({
    name: 'editMode',
    initialState,
    reducers: {
        setEditMode(state, action) {
            state.isEditTrade = action.payload;
        },
        setTradeForEdit(state, action) {
            state.tradeToEdit = action.payload;
        }
    },
});

export const { setTradeForEdit, setEditMode } = editTradeFormSlice.actions;

export const selectIsEditMode = (state) => state.editMode.isEditTrade
export const selectTradeToEdit = (state) => state.editMode.tradeToEdit

export default editTradeFormSlice.reducer;