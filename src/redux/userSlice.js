// src/redux/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    isLoggedIn: false,
    authError: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginSuccess(state, action) {
            state.user = action.payload.username;
            state.isLoggedIn = true;
            state.authError = null;
        },
        loginFailure(state, action) {
            state.user = null;
            state.isLoggedIn = false;
            state.authError = action.payload.error;
        },
        logoutUser(state) {
            state.user = null;
            state.isLoggedIn = false;
            state.authError = null;
        },
    },
});

export const { loginSuccess, loginFailure, logoutUser } = userSlice.actions;
export default userSlice.reducer;
