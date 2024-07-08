import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { addSnackbarState } from "../Snackbar/SnackbarSlice";
import { signOut } from "../AuthSlice/auth";

const initialState = {
    data: null,
    loading: false,
    error: null,
};

export const deleteAdminAccountAsync = createAsyncThunk(
    'delete/deleteAdminAccount',
    async ( userId , { getState, dispatch, rejectWithValue }) => {
        const { token } = getState().auth;
        try {
            const response = await axios.delete(`https://e-commerce-shopkart-backend-rho.vercel.app/shopkart/delete/${userId}/delete-admin`, {
                headers: {
                    Token: token
                }
            });
            dispatch(
                addSnackbarState({
                    snackbarOpen: true,
                    snackbarMessage: 'Admin account deleted successfully!',
                    snackbarSeverity: 'success',
                })
            );
            dispatch(signOut());
            localStorage.removeItem('token');
            return response.data.message;
        } catch (error) {
            dispatch(
                addSnackbarState({
                    snackbarOpen: true,
                    snackbarMessage: "Something went wrong! please try again.",
                    snackbarSeverity: 'error',
                })
            );
            return rejectWithValue(errorMessage);
        }
    }
);

const deleteAdminAccountSlice = createSlice({
    name: 'deleteAdminAccount',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(deleteAdminAccountAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAdminAccountAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(deleteAdminAccountAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error;
            });
    },
});

export default deleteAdminAccountSlice.reducer;
