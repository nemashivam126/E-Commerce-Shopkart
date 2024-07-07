import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    selectedAddress: null,
    loading: false,
    error: null,
};

// Async thunk to select an address
export const selectAddress = createAsyncThunk(
    'selectedAddress/selectAddress',
    async ({ userId, addressId }, { getState }) => {
        const { token } = getState().auth;
        const response = await axios.put(`https://e-commerce-shopkart-backend.vercel.app/shopkart/user/${userId}/selected-address/${addressId}`, {}, {
            headers: {
                Token: token
            }
        });
        return response.data.selectedAddress;
    }
);

const selectedAddressSlice = createSlice({
    name: 'selectedAddress',
    initialState,
    reducers: {
        setSelectedAddress: (state, action) => {
            state.selectedAddress = action.payload;
        },
        resetSelectedAddress : (state) => {
            state.selectedAddress = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(selectAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(selectAddress.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedAddress = action.payload;
            })
            .addCase(selectAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { setSelectedAddress, resetSelectedAddress } = selectedAddressSlice.actions;
export default selectedAddressSlice.reducer;
