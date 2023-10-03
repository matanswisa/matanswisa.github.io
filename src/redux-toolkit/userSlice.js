import { roles } from '../utils/roles';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    currentAccount: null,
    role: 0,
    isAuthenticated: false,
    isAdmin: false,
    alerts: [],
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action) {
            localStorage.setItem(`user`, JSON.stringify(action.payload.user));
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.isAdmin = action.payload.user.role === roles.admin;
            state.alerts = action.payload.user.alert;
   
        },
        logout(state) {
            state.user = null;
            state.isAuthenticated = false;
            state.isAdmin = false;
            state.currentAccount = null;
            state.alerts = [];
        },
        setAlerts(state,action){
            state.alerts = action.payload;
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
            state.user.accounts.push(action.payload);
        },
        updateAccountList(state, action) {
            state.user.accounts = action.payload;
        },
        updateAccount(state, action) {
            const currAccounts = state.user.accounts.filter(account => account._id !== action.payload._id);
            currAccounts.push(action.payload);
            state.user.accounts = currAccounts;
        },
        removeAccount(state, action) {
            const currAccounts = state.user.accounts.filter(account => account._id !== action.payload.accountId);
            state.user.accounts = currAccounts;
        },
        setTradesList(state, action) {
            state.currentAccount.trades = action.payload;
        },
    },
});

export const { login, logout, selectIsAdmin, setCurrentAccount, addAccountToList, removeAccount, setTradesList, updateAccountList , setAlerts } = authSlice.actions;

//Selectors
export const selectUserAccounts = (state) => state.auth.user.accounts;
export const selectCurrentAccount = (state) => state.auth.currentAccount;
export const selectTradesOfCurrentAccount = (state) => state.auth.currentAccount.trades;
export const selectUserName = (state) => state.auth.user?.username;
export const selectUser = (state) => state.auth.user;
export const selectAlerts = (state) => state.auth.alerts;
export const selectUserAdmin = (state) => state.auth.isAdmin;
export const isUserAuthenticated = (state) => state.auth.isAuthenticated;



export default authSlice.reducer;