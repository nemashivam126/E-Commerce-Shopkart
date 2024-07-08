import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const getProductByIdAsync = createAsyncThunk('products/getProduct', async (productId, { getState, dispatch }) => {
  const { token } = (getState()).auth;
  try {
    const response = await axios.get(`https://e-commerce-shopkart-backend-rho.vercel.app/shopkart/products/${productId}`, {
      headers: {
        Token: token,
      }
    });
    // dispatch(fetchProductsAsync());
    return response.data;
  } catch (error) {
    console.error('Product fetching Error:', error);
    throw new Error(error);
  }
});

const getProductSlice = createSlice({
  name: 'getProduct',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProductByIdAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getProductByIdAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(getProductByIdAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default getProductSlice.reducer;
