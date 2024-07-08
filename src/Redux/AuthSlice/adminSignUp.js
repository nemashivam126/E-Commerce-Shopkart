import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { addSnackbarState } from '../Snackbar/SnackbarSlice';
import { setAuthState } from './auth';

const initialState = {
  status: 'idle',
  error: null,
  data: null
};

export const adminSignUpAsync = createAsyncThunk(
  'adminAuth/adminSignUp',
  async ({ user, image }, { getState, rejectWithValue, dispatch }) => {
    const { token } = getState().auth;
    const formData = new FormData();
    Object.keys(user).forEach((key) => {
      formData.append(key, user[key]);
    });
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await axios.post('https://e-commerce-shopkart-backend-rho.vercel.app/shopkart/admin/SignUp', formData, {
        headers: {
          Token: token
        },
      });
      // const { token, user: newUser } = response.data;

      // Update the shared auth state
      // dispatch(setAuthState({ token, isAuthenticated: true, user: newUser }));
      // localStorage.setItem('token', token);

      dispatch(
        addSnackbarState({
          snackbarOpen: true,
          snackbarMessage: "Admin Account Created Successfully!",
          snackbarSeverity: "success",
        })
      );

      return response.data;
    } catch (error) {
      const errorMessage =  "Something went wrong!";
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

const adminSignUpSlice = createSlice({
  name: 'adminSignUp',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(adminSignUpAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(adminSignUpAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload
      })
      .addCase(adminSignUpAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default adminSignUpSlice.reducer;
