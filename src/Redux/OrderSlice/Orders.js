// src/Redux/OrderSlice/getOrders.js

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchOrdersAsync = createAsyncThunk(
  'orders/fetchOrders',
  async (userId, { getState, rejectWithValue }) => {
    const { token } = (getState()).auth;
    try {
      const response = await axios.get(`https://e-commerce-shopkart-backend-rho.vercel.app/shopkart/user/${userId}/orders`, {
        headers: {
            Token: token
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    data: [],
    loading: false,
    error: null
  },
  reducers: {
    resetOrders: (state) => {
      state.data = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchOrdersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetOrders } = orderSlice.actions;
export default orderSlice.reducer;
