import { roles } from '../utils/roles';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    accounts: [],
    user: null,
    currentAccount: null,
    role: 0,
    isAuthenticated: false,
    isAdmin: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action) {
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.accounts = action.payload.user.accounts
            state.isAdmin = action.payload.user.role === roles.admin;
        },
        logout(state) {
            state.user = null;
            state.isAuthenticated = false;
            state.isAdmin = false;
            state.currentAccount = null;
        },
        selectIsAuthenticated(state) {
            return state.isAuthenticated;
        },
        selectIsAdmin(state) {
            return state.isAdmin;
        },
        setCurrentAccount(state, action) {
            state.currentAccount = action.payload;
        },

        addAccountToList(state, action) {
            // state.
            console.log(action.payload);
            state.accounts.push(action.payload);
        },
        updateAccountList(state, action) {
            state.accounts = action.payload;
        },
        updateAccount(state, action) {
            const currAccounts = state.user.accounts.filter(account => account._id !== action.payload._id);
            currAccounts.push(action.payload);
            state.accounts = currAccounts;
        },
        removeAccount(state, action) {
            const currAccounts = state.user.accounts.filter(account => account._id !== action.payload.accountId);
            state.accounts = currAccounts;
        },
        setTradesList(state, action) {
            state.currentAccount.trades = action.payload;
        },
    },
});

export const { login, logout, selectIsAdmin, setCurrentAccount, addAccountToList, removeAccount, setTradesList, updateAccountList } = authSlice.actions;

//Selectors
export const selectUserAccounts = (state) => state.auth.accounts;
export const selectCurrentAccount = (state) => state.auth.currentAccount;
export const selectTradesOfCurrentAccount = (state) => state.auth.currentAccount.trades;
export const selectUserName = (state) => state.auth.user?.username;
export const selectUser = (state) => state.auth.user;
export const selectUserAdmin = (state) => state.auth.isAdmin;
export const isUserAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAccessToken = (state) => state.auth.user.accessToken;
export const selectRefreshToken = (state) => state.auth.user.refreshToken;



export default authSlice.reducer;