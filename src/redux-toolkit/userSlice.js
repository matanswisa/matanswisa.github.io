import { roles } from '../utils/roles';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
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
            state.isAdmin = action.payload.user.role === roles.admin;
        },
        logout(state) {
            state.user = null;
            state.isAuthenticated = false;
            state.isAdmin = false;
        },
        selectIsAuthenticated(state) {
            return state.isAuthenticated;
        },
        selectIsAdmin(state) {
            return state.isAdmin;
        },
        initializeUser(state) {
            const persistedUser = JSON.parse(localStorage.getItem('user'));
            if (persistedUser) {
                state.user = persistedUser;
                state.isAuthenticated = true;
                state.isAdmin = persistedUser.role === roles.admin;
            }
        },
    },
});

export const { login, logout, selectIsAdmin, initializeUser } = authSlice.actions;
export const selectUserAccounts = (state) => state.user.accounts;
export const selectUserName = (state) => state.auth.user?.username;
export const selectUser = (state) => state.auth.user;
export const selectUserAdmin = (state) => state.auth.isAdmin;
export const isUserAuthenticated = (state) => state.auth.isAuthenticated;



export default authSlice.reducer;
