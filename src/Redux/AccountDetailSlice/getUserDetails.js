import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    data: null,
    loading: false,
    error: null,
};

export const getUserDetailsAsync = createAsyncThunk(
    'userDetail/getUserDetails',
    async ( userId , { getState }) => {
        const { token } = getState().auth;
        const response = await axios.get(`https://e-commerce-shopkart-backend-rho.vercel.app/shopkart/view-user/${userId}`, {
            headers: {
                Token: token
            }
        });
        return response.data;
    }
);

const getUserDetailSlice = createSlice({
    name: 'getUserDetails',
    initialState: initialState,
    reducers: {
        resetUserData : (state) => {
            state.data = null,
            state.loading = false,
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserDetailsAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserDetailsAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(getUserDetailsAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error;
            });
    },
});

export const { resetUserData } = getUserDetailSlice.actions;
export default getUserDetailSlice.reducer;
