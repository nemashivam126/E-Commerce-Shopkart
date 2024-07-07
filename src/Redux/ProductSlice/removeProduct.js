import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { addSnackbarState } from '../Snackbar/SnackbarSlice';
import { fetchProductsAsync } from './fetchProducts';

const initialState = {
  status: "idle",
  error: null,
};

export const removeProductAsync = createAsyncThunk(
  'product/removeProduct',
  async (id, { getState ,dispatch }) => {
    const { token } = (getState()).auth;
    try {
      const response = await axios.delete(
        `https://e-commerce-shopkart-backend.vercel.app/shopkart/remove-product/${id}`,
        {
          headers: {
            Token: token,
          }
        }
      );
      dispatch(
        addSnackbarState({
          snackbarOpen: true,
          snackbarMessage: "Product removed successfully!",
          snackbarSeverity: "success",
        })
      );
      dispatch(fetchProductsAsync());
      return response.data;
    } catch (error) {
      dispatch(
        addSnackbarState({
          snackbarOpen: true,
          snackbarMessage: error,
          snackbarSeverity: 'error',
        })
      );
      throw error;
    }
  }
);

const removeProductSlice = createSlice({
  name: 'removeProduct',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(removeProductAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(removeProductAsync.fulfilled, (state) => {
        state.status = "fulfilled";
      })
      .addCase(removeProductAsync.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      });
  },
});

export const removeProductStatus = (state) => state.updateStock.status;
export default removeProductSlice.reducer;
