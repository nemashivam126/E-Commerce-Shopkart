import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { addSnackbarState } from "../Snackbar/SnackbarSlice";

const initialState = {
    data: null,
    loading: false,
    error: null,
};

// Async thunk to select an address
export const removeAddressAsync = createAsyncThunk(
    'address/removeAddress',
    async ({ userId, addressId }, { getState, dispatch }) => {
        const { token } = getState().auth;
        try {
            const response = await axios.delete(`https://e-commerce-shopkart-backend-rho.vercel.app/shopkart/user/${userId}/addresses/${addressId}`, {
                headers: {
                    Token: token
                }
            });
            dispatch(
                addSnackbarState({
                snackbarOpen: true,
                snackbarMessage: "Address removed successfully!",
                snackbarSeverity: "success",
                })
            );
            return response.data;
        } catch (error) {
            dispatch(
                addSnackbarState({
                  snackbarOpen: true,
                  snackbarMessage: error,
                  snackbarSeverity: "error",
                })
            );
        }
    }
);

const removeAddressSlice = createSlice({
    name: 'removeAddress',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(removeAddressAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeAddressAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(removeAddressAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default removeAddressSlice.reducer;
