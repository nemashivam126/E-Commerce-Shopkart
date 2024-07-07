import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { fetchProductsAsync } from './fetchProducts';

const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const viewProductAsync = createAsyncThunk('products/viewProduct', async (productId, { getState, dispatch }) => {
  const { token } = (getState()).auth;
  try {
    const response = await axios.get(`https://e-commerce-shopkart-backend.vercel.app/shopkart/view-product/${productId}`, {
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

const ViewProductSlice = createSlice({
  name: 'viewProduct',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(viewProductAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(viewProductAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(viewProductAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default ViewProductSlice.reducer;
