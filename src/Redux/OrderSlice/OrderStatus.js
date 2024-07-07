// orderStatusSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  data: [],
  loading: false,
  error: null,
};

export const updateOrderStatusAsync = createAsyncThunk(
  'orderStatus/updateOrderStatusAsync',
  async ({ userId, itemId, newStatus }, { getState }) => {
    try {
      const { token } = (getState()).auth;
      const response = await axios.put(
        `https://e-commerce-shopkart-backend.vercel.app/shopkart/orders/${userId}/items/${itemId}`,
        { status: newStatus },
        { headers: { Token: token } }
      );
      return { userId, itemId, newStatus };
    } catch (error) {
      throw Error('Error updating order status');
    }
  }
);

const orderStatusSlice = createSlice({
  name: 'orderStatus',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateOrderStatusAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatusAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        // Handle any state updates upon successful status update if needed
      })
      .addCase(updateOrderStatusAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const selectOrderStatusLoading = (state) => state.orderStatus.loading;

export default orderStatusSlice.reducer;
