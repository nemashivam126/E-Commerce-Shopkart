import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    productMainId: null,
    productId: null,
    userId: null,
    addressId: null,
};

const GetIDsSlice = createSlice({
    name: 'getIDs',
    initialState: initialState,
    reducers: {
        setProductMainId: (state, action) => {
            state.productMainId = action.payload;
        },
        setProductId: (state, action) => {
            state.productId = action.payload;
        },
        setUserId: (state, action) => {
            state.userId = action.payload;
        },
        setAddressId: (state, action) => {
            state.addressId = action.payload;
        },
        clearIds: (state) => {
            state.productMainId = null;
            state.productId = null;
            state.userId = null;
            state.addressId = null;
        }
    }
});

export const { setProductMainId, setProductId, setUserId, setAddressId, clearIds } = GetIDsSlice.actions;
export default GetIDsSlice.reducer;
