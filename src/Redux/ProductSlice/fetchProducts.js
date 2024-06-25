import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchProductsAsync = createAsyncThunk('products/fetchProductsList', async (_,{ getState }) => {
  const { token } = (getState()).auth;
  try {
    const response = await axios.get('http://localhost:5000/shopkart/products', {
      headers: {
        token: token,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Product fetching Error:', error);
    throw new Error(error);
  }
});

const ProductSlice = createSlice({
  name: 'getProducts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductsAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload.reverse();
      })
      .addCase(fetchProductsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default ProductSlice.reducer;
