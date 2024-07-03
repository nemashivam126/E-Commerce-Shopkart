import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    addresses: [],
    loading: false,
    error: null,
};

// Async thunk to fetch addresses
export const fetchAddresses = createAsyncThunk(
    'addresses/fetchAddresses',
    async (userId, { getState }) => {
        const { token } = getState().auth;
        const response = await axios.get(`http://localhost:5000/shopkart/user/${userId}/addresses`, {
            headers: {
                Token: token
            }
        });
        return response.data;
    }
);

const addressesSlice = createSlice({
    name: 'addresses',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAddresses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAddresses.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses = action.payload;
            })
            .addCase(fetchAddresses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default addressesSlice.reducer;
