import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  count: 0,
  status: 'idle',
  error: null,
};

export const getCartCountAsync = createAsyncThunk('cart/cartCount', async (userId, { getState }) => {
  const { token } = (getState()).auth;
  try {
    const response = await axios.get(`https://e-commerce-shopkart-backend-rho.vercel.app/shopkart/cart-count/${userId}`, {
      headers: {
        Token: token,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Count Fetching Error:', error);
    throw new Error(error);
  }
});

const cartCountSlice = createSlice({
  name: 'cartCount',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCartCountAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getCartCountAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.count = action.payload;
      })
      .addCase(getCartCountAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default cartCountSlice.reducer;
