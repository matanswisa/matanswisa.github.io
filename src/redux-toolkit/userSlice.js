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

// const updateUserLocalStorage = (user) => {
//     loc
// }
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action) {
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.isAdmin = action.payload.user.role === roles.admin;
            state.alerts = action.payload.user.alerts;
        },
        logout(state) {
            state.user = null;
            state.isAuthenticated = false;
            state.isAdmin = false;
            state.currentAccount = null;
            state.alerts = [];
        },
        setAlerts(state, action) {
            state.alerts = action.payload;
            state.user.alerts = action.payload;
            console.log("inside setAlerts",action.payload)
            localStorage.setItem(`user`, JSON.stringify(state.user));
        },
        selectIsAuthenticated(state) {
            return state.isAuthenticated;
        },
        selectIsAdmin(state) {
            return state.isAdmin;
        },
        setCurrentAccount(state, action) {
            state.currentAccount = action.payload;
            const temp = state.user;
            localStorage.setItem(`user`, JSON.stringify(temp));
        },
        updateAccountList(state, action) {
            state.user.accounts = action.payload;
            const temp = state.user;
            localStorage.setItem(`user`, JSON.stringify(temp));
        },
        updateAccount(state, action) {
            const currAccounts = state.user.accounts.filter(account => account._id !== action.payload._id);
            currAccounts.push(action.payload);
            state.user.accounts = currAccounts;
            const temp = state.user;
            localStorage.setItem(`user`, JSON.stringify(temp));
        },
        removeAccount(state, action) {
            const currAccounts = state.user.accounts.filter(account => account._id !== action.payload.accountId);
            state.user.accounts = currAccounts;
            const temp = state.user;
            localStorage.setItem(`user`, JSON.stringify(temp));
        },
        setTradesList(state, action) {
            state.currentAccount.trades = action.payload;
            const temp = state.user;
            localStorage.setItem(`user`, JSON.stringify(temp));
        },
    },
});

export const { login, logout, selectIsAdmin, setCurrentAccount, removeAccount, setTradesList, updateAccountList, setAlerts } = authSlice.actions;

//Selectors
export const selectUserAccounts = (state) => state.auth.user?.accounts;
export const selectCurrentAccount = (state) => state.auth.currentAccount;
export const selectCurrentAccountTrades = (state) => state.auth.currentAccount.trades;
export const selectTradesOfCurrentAccount = (state) => state.auth.currentAccount.trades;
export const selectUserName = (state) => state.auth.user?.username;
export const selectUser = (state) => state.auth.user;
export const selectAlerts = (state) => state.auth.alerts;
export const selectUserAdmin = (state) => state.auth.isAdmin;
export const isUserAuthenticated = (state) => state.auth.isAuthenticated;



export default authSlice.reducer;