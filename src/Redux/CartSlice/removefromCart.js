// src/redux/cartSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import auth from '../AuthSlice/auth';
import { addSnackbarState } from '../Snackbar/SnackbarSlice';
import { getCartCountAsync } from './cartCount';

const initialState = {
  user: null,
  status: 'idle',
  error: null,
};

// Async thunk to remove a product from user's cart
export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCart',
  async ({ userId, productId }, { getState, rejectWithValue, dispatch }) => {
    const { token } = (getState()).auth;
    try {
      const response = await axios.delete(
        `https://e-commerce-shopkart-backend.vercel.app/shopkart/user/${userId}/remove-cart`,
        {
          data: { productId }, // Send productId in request body
          headers: {
            Token: token
          },
        }
      );
      dispatch(getCartCountAsync(userId));
      dispatch(
        addSnackbarState({
            snackbarOpen: true,
            snackbarMessage: 'Item removed from cart!',
            snackbarSeverity: "success",
        })
      );
      return response.data;
    } catch (error) {
        dispatch(
            addSnackbarState({
                snackbarOpen: true,
                snackbarMessage: 'Something went wrong!',
                snackbarSeverity: "error",
            })
        );
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice definition
const removeCartSlice = createSlice({
  name: 'removeCart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(removeFromCartAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.user = action.payload;
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload.message;
      });
  },
});

export default removeCartSlice.reducer;
