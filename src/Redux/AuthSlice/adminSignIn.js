import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAuthState } from './auth';
import { addSnackbarState } from '../Snackbar/SnackbarSlice';

const initialState = {
  loading: false,
  error: null,
};

export const adminSignInAsync = createAsyncThunk(
  'adminAuth/adminSignIn',
  async (credentials, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post('https://e-commerce-shopkart-backend.vercel.app/shopkart/admin/SignIn', credentials);
      const { token, user } = response.data;

      // Update the shared auth state
      dispatch(setAuthState({ token, isAuthenticated: true, user }));
      localStorage.setItem('token', token);

      dispatch(
        addSnackbarState({
          snackbarOpen: true,
          snackbarMessage: "Logged in successfully!",
          snackbarSeverity: "success",
        })
      );

      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(
        addSnackbarState({
          snackbarOpen: true,
          snackbarMessage: errorMessage,
          snackbarSeverity: "error",
        })
      );
      return rejectWithValue(errorMessage);
    }
  }
);

const adminSignInSlice = createSlice({
  name: 'adminSignIn',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(adminSignInAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminSignInAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(adminSignInAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminSignInSlice.reducer;
