import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    data: null,
    loading: false,
    error: null,
};

export const getAdminDetailsAsync = createAsyncThunk(
    'adminDetail/getAdminDetails',
    async ( userId , { getState }) => {
        const { token } = getState().auth;
        const response = await axios.get(`https://e-commerce-shopkart-backend-rho.vercel.app/shopkart/view-admin/${userId}`, {
            headers: {
                Token: token
            }
        });
        return response.data;
    }
);

const getAdminDetailSlice = createSlice({
    name: 'getAdminDetails',
    initialState: initialState,
    reducers: {
        resetAdminData : (state) => {
            state.data = null,
            state.loading = false,
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAdminDetailsAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAdminDetailsAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(getAdminDetailsAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error;
            });
    },
});

export const { resetAdminData } = getAdminDetailSlice.actions;
export default getAdminDetailSlice.reducer;
