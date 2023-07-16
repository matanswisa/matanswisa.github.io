// import { createSlice } from '@reduxjs/toolkit';
/* Workaround for error:
Uncaught SyntaxError: The requested module '/node_modules/@reduxjs/toolkit/dist/index.js' does not provide an export named 'createSlice' (at authSlice.js:1:10)
FROM: https://github.com/reduxjs/redux-toolkit/issues/1960
*/
import * as toolkitRaw from '@reduxjs/toolkit';
import { roles } from '../../utils/roleTypes';
const { createSlice } = toolkitRaw.default ?? toolkitRaw;

const initialState = {
    user: '',
    role: '',
    isAuthenticated: false,
    isSuperAdmin: false  // New state to check if user is SUPER_ADMIN
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action) {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.isUserAdmin = action.payload.role === roles.ADMIN
        },
        logout(state) {
            state.user = '';
            state.isAuthenticated = false;
            state.isSuperAdmin = false; // Reset isSuperAdmin when logging out
        },
        selectIsAuthenticated(state) {
            return state.isAuthenticated;
        },
        selectIsSuperAdmin(state) {
            return state.isSuperAdmin;
        }
    }
});


export const { login, logout } = authSlice.actions;

// Add a selector function to fetch the user's username
export const selectUserName = (state) => state.auth.user.username;

export default authSlice.reducer;


// export const { login, logout, verifyUserName } = UserSlice.actions;
// export const selectUser = (state) => state.user.user;
// const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
// export const selectUserName = (state) => state.user.username;
// export default UserSlice.reducer;