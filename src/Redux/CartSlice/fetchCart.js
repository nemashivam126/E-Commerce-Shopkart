import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchCartDetailsAsync = createAsyncThunk('cart/fetchUserCart', async (userId, { getState, dispatch }) => {
  const { token } = (getState()).auth;
  try {
    const response = await axios.get(`https://e-commerce-shopkart-backend.vercel.app/shopkart/user/${userId}/cart`, {
      headers: {
        Token: token,
      }
    });
    // dispatch(fetchProductsAsync());
    return response.data;
  } catch (error) {
    console.error('Cart fetching Error:', error);
    throw new Error(error);
  }
});

const UserCartSlice = createSlice({
  name: 'getUserCart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartDetailsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCartDetailsAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchCartDetailsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default UserCartSlice.reducer;
