import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { addSnackbarState } from '../Snackbar/SnackbarSlice';
import { setAuthState } from './auth';

const initialState = {
  status: 'idle',
  error: null,
};

export const userSignUpAsync = createAsyncThunk(
  'userAuth/userSignUp',
  async ({ user, image }, { rejectWithValue, dispatch }) => {
    const formData = new FormData();
    Object.keys(user).forEach((key) => {
      formData.append(key, user[key]);
    });
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await axios.post('https://e-commerce-shopkart-backend-rho.vercel.app/shopkart/SignUp', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const { token, user: newUser } = response.data;

      // Update the shared auth state
      dispatch(setAuthState({ token, isAuthenticated: true, user: newUser }));
      localStorage.setItem('token', token);

      dispatch(
        addSnackbarState({
          snackbarOpen: true,
          snackbarMessage: "Signed in successfully!",
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

const userSignUpSlice = createSlice({
  name: 'userSignUp',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(userSignUpAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(userSignUpAsync.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(userSignUpAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default userSignUpSlice.reducer;
