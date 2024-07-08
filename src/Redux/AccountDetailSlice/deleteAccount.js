import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { addSnackbarState } from "../Snackbar/SnackbarSlice";
import { signOut } from "../AuthSlice/auth";

const initialState = {
    data: null,
    loading: false,
    error: null,
};

export const deleteUserAccountAsync = createAsyncThunk(
    'delete/deleteUserAccount',
    async ( userId , { getState, dispatch, rejectWithValue }) => {
        const { token } = getState().auth;
        try {
            const response = await axios.delete(`https://e-commerce-shopkart-backend-rho.vercel.app/shopkart/delete/${userId}/delete-user`, {
                headers: {
                    Token: token
                }
            });
            dispatch(
                addSnackbarState({
                    snackbarOpen: true,
                    snackbarMessage: 'User account deleted successfully!',
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

const deleteUserAccountSlice = createSlice({
    name: 'deleteUserAccount',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(deleteUserAccountAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUserAccountAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(deleteUserAccountAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error;
            });
    },
});

export default deleteUserAccountSlice.reducer;
