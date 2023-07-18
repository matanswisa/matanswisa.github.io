// import { createSlice } from '@reduxjs/toolkit';
/* Workaround for error:
Uncaught SyntaxError: The requested module '/node_modules/@reduxjs/toolkit/dist/index.js' does not provide an export named 'createSlice' (at authSlice.js:1:10)
FROM: https://github.com/reduxjs/redux-toolkit/issues/1960
*/
import { roles } from '../utils/roles';
import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    user: {},
    role: 0,
    isAuthenticated: false,
    isAdmin: false  // New state to check if user is SUPER_ADMIN
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action) {
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.isAdmin = action.payload.user.role === roles.admin
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
        }
    }
});


export const { login, logout, selectIsAdmin } = authSlice.actions;

export const selectUserName = (state) => state.auth.user.username;
export const selectUser = (state) => state.auth.user;
export const selectUserAdmin = (state) => state.auth.isAdmin;

export default authSlice.reducer;
