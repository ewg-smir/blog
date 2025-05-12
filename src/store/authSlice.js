import { createSlice } from '@reduxjs/toolkit';
import { authApi } from './authApi';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearLoginState(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.loginUser.matchFulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.user.token;
        state.isAuthenticated = true;
      })
      .addMatcher(authApi.endpoints.getCurrentLoginUser.matchFulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addMatcher(authApi.endpoints.loginUser.matchRejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      .addMatcher(authApi.endpoints.getCurrentLoginUser.matchRejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { clearLoginState } = authSlice.actions;
export default authSlice.reducer;
