import { createSlice } from '@reduxjs/toolkit';

export const accountsSlice = createSlice({
    name: 'accounts',
    initialState: {
        accounts: [],
        currentAccount: null,
    },
    reducers: {
        setUserAccounts: (state, action) => {

            state.accounts = action.payload;
        },
        setCurrentAccount: (state, action) => {

            state.currentAccount = action.payload;
        },
    },
});

export const { setUserAccounts, setCurrentAccount } = accountsSlice.actions;

export const getCurrentAccount = (state) => state.currentAccount;
export const getAccounts = (state) => state.accounts;
export const getTrades = (state) => state.accounts.trades;

export default accountsSlice.reducer;