import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState: (state, action) => {
      state.token = action.payload.token;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
    },
    clearAuthState: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
    },
    signOut: (state) => {
        state.token = null;
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem('token');
    },
  },
});

export const { setAuthState, clearAuthState, signOut } = authSlice.actions;
export default authSlice.reducer;
