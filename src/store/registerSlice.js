import { createSlice } from '@reduxjs/toolkit';
import { registerApi } from './registerApi';

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    clearRegisterState: (state) => {
      state.loading = false;
      state.error = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(registerApi.endpoints.registerUser.matchPending, (state) => {
        state.loading = true;
        state.error = null;
        state.user = null;
      })
      .addMatcher(registerApi.endpoints.registerUser.matchFulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addMatcher(registerApi.endpoints.registerUser.matchRejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Registration failed';
      });
  },
});

export const { clearRegisterState } = registerSlice.actions;

export default registerSlice.reducer;
